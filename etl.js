/**
 * ETL Script for Beer Recommendation App
 * Processes raw CSV and Newick files into optimized JSON assets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const RAW_DATA_DIR = path.join(__dirname, 'raw_data');
const OUTPUT_DIR = path.join(__dirname, 'public', 'data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Parse CSV file into array of objects
 */
function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split(/\r?\n/);
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj = {};
        headers.forEach((header, i) => {
            obj[header.trim()] = values[i]?.trim() || '';
        });
        return obj;
    });
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

/**
 * Parse Newick tree format into JSON structure
 */
function parseNewick(newickString) {
    newickString = newickString.trim().replace(/;$/, '');

    let index = 0;

    function parseNode() {
        const node = {
            name: '',
            length: 0,
            children: []
        };

        if (newickString[index] === '(') {
            index++; // skip '('

            // Parse children
            while (newickString[index] !== ')') {
                node.children.push(parseNode());
                if (newickString[index] === ',') {
                    index++; // skip ','
                }
            }
            index++; // skip ')'
        }

        // Parse name
        let name = '';
        while (index < newickString.length &&
            newickString[index] !== ':' &&
            newickString[index] !== ',' &&
            newickString[index] !== ')' &&
            newickString[index] !== ';') {
            name += newickString[index];
            index++;
        }
        node.name = name.trim().replace(/'/g, ''); // Remove quotes

        // Parse branch length
        if (newickString[index] === ':') {
            index++; // skip ':'
            let length = '';
            while (index < newickString.length &&
                newickString[index] !== ',' &&
                newickString[index] !== ')' &&
                newickString[index] !== ';') {
                length += newickString[index];
                index++;
            }
            node.length = parseFloat(length) || 0;
        }

        return node;
    }

    return parseNode();
}

/**
 * Process beers database
 */
function processBeers() {
    console.log('Processing beers database...');
    const beersPath = path.join(RAW_DATA_DIR, 'beers-db.csv');
    const beersData = parseCSV(beersPath);

    const beers = beersData
        .filter(beer => beer.ID && beer.Name && beer.ID !== '22' && beer.ID !== '98' && beer.ID !== '99' && beer.ID !== '100' && beer.ID !== '101' && beer.ID !== '108' && beer.ID !== '109') // Filter out water/control samples
        .map(beer => ({
            id: parseInt(beer.ID),
            name: beer.Name,
            brewery: beer.Brewery,
            country: beer.Country,
            region: beer.Region,
            style: beer.Style,
            abv: parseFloat(beer.ABV) || 0,
            ibu: parseFloat(beer.IBU) || 0,
            srm: parseFloat(beer.SRM) || 0,
            has_yeast_data: beer.has_yeast_data === '1'
        }));

    console.log(`Processed ${beers.length} beers`);
    return beers;
}

/**
 * Process Raman spectra data
 */
function processRaman(validBeerIds) {
    console.log('Processing Raman spectra...');
    const ramanPath = path.join(RAW_DATA_DIR, 'raman-data.csv');
    const content = fs.readFileSync(ramanPath, 'utf-8');
    const lines = content.trim().split(/\r?\n/);

    // First line is header with wavenumbers
    const header = lines[0].split(',');

    const raman = {};

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const beerId = parseInt(values[0]);

        // Only include valid beer IDs
        if (validBeerIds.has(beerId)) {
            // Skip first column (ID) and round to 4 decimals
            const spectrum = values.slice(1).map(v => {
                const num = parseFloat(v);
                return isNaN(num) ? 0 : Math.round(num * 10000) / 10000;
            });

            raman[beerId] = spectrum;
        }
    }

    console.log(`Processed Raman data for ${Object.keys(raman).length} beers`);
    return raman;
}

/**
 * Process yeast abundance data
 */
function processYeast(validBeerIds) {
    console.log('Processing yeast abundance data...');
    const yeastPath = path.join(RAW_DATA_DIR, 'yeast-data.csv');
    const yeastData = parseCSV(yeastPath);

    if (yeastData.length === 0) {
        console.log('No yeast data found');
        return {};
    }

    // Get species names from header (skip first column which is ID)
    const content = fs.readFileSync(yeastPath, 'utf-8');
    const headerLine = content.trim().split(/\r?\n/)[0];
    const headers = parseCSVLine(headerLine);
    const speciesNames = headers.slice(1); // Skip ID column

    const yeast = {};

    yeastData.forEach(row => {
        const beerId = parseInt(row[headers[0]]); // First column is ID

        // Only include valid beer IDs
        if (validBeerIds.has(beerId)) {
            const abundances = {};
            let totalReads = 0;

            // Get raw counts for each species
            speciesNames.forEach((species, idx) => {
                const count = parseInt(row[headers[idx + 1]]) || 0;
                if (count > 0) {
                    abundances[species] = count;
                    totalReads += count;
                }
            });

            // Convert to relative abundances
            if (totalReads > 0) {
                const relativeAbundances = {};
                Object.entries(abundances).forEach(([species, count]) => {
                    relativeAbundances[species] = count / totalReads;
                });
                yeast[beerId] = relativeAbundances;
            }
        }
    });

    console.log(`Processed yeast data for ${Object.keys(yeast).length} beers`);
    return yeast;
}

/**
 * Process phylogenetic tree
 */
function processTree() {
    console.log('Processing phylogenetic tree...');
    const treePath = path.join(RAW_DATA_DIR, 'yeast_ITS1_phylogenetic_tree.nwk');

    if (!fs.existsSync(treePath)) {
        // Try alternative name
        const altPath = path.join(RAW_DATA_DIR, 'yeast-tree.nwk');
        if (fs.existsSync(altPath)) {
            const newickString = fs.readFileSync(altPath, 'utf-8');
            const tree = parseNewick(newickString);
            console.log('Phylogenetic tree processed successfully');
            return tree;
        }
    }

    const newickString = fs.readFileSync(treePath, 'utf-8');
    const tree = parseNewick(newickString);
    console.log('Phylogenetic tree processed successfully');
    return tree;
}

/**
 * Main ETL process
 */
function main() {
    console.log('Starting ETL process...\n');

    try {
        // Process beers first to get valid IDs
        const beers = processBeers();
        const validBeerIds = new Set(beers.map(b => b.id));

        // Process other datasets
        const raman = processRaman(validBeerIds);
        const yeast = processYeast(validBeerIds);
        const tree = processTree();

        // Write output files
        console.log('\nWriting output files...');

        fs.writeFileSync(
            path.join(OUTPUT_DIR, 'beers.json'),
            JSON.stringify(beers, null, 2)
        );
        console.log('✓ beers.json');

        fs.writeFileSync(
            path.join(OUTPUT_DIR, 'raman.json'),
            JSON.stringify(raman)
        );
        console.log('✓ raman.json');

        fs.writeFileSync(
            path.join(OUTPUT_DIR, 'yeast.json'),
            JSON.stringify(yeast, null, 2)
        );
        console.log('✓ yeast.json');

        fs.writeFileSync(
            path.join(OUTPUT_DIR, 'tree.json'),
            JSON.stringify(tree, null, 2)
        );
        console.log('✓ tree.json');

        console.log('\n✅ ETL process completed successfully!');
        console.log(`\nSummary:`);
        console.log(`- ${beers.length} beers`);
        console.log(`- ${Object.keys(raman).length} Raman spectra`);
        console.log(`- ${Object.keys(yeast).length} yeast profiles`);
        console.log(`- Phylogenetic tree with ${countNodes(tree)} nodes`);

    } catch (error) {
        console.error('❌ ETL process failed:', error);
        process.exit(1);
    }
}

/**
 * Count nodes in tree
 */
function countNodes(node) {
    if (!node) return 0;
    let count = 1;
    if (node.children) {
        node.children.forEach(child => {
            count += countNodes(child);
        });
    }
    return count;
}

// Run ETL
main();
