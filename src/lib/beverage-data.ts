export type BeverageCategory = 'coffee' | 'tea' | 'energy' | 'soda' | 'other';

export interface Beverage {
    id: string;
    name: string;
    brand: string;
    category: BeverageCategory;
    caffeinePerOz: number;
}

export const BEVERAGE_DATABASE: Beverage[] = [
    // --- COFFEE: Coffee Shop Standards & Chains ---
    { id: 'sbx-pike', name: 'Pike Place Roast', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 19.38 }, // 310mg / 16oz
    { id: 'sbx-blonde', name: 'Blonde Roast', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 22.5 }, // 360mg / 16oz
    { id: 'sbx-dark', name: 'Dark Roast', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 16.25 }, // 260mg / 16oz
    { id: 'sbx-cold-brew', name: 'Cold Brew', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 12.8 }, // 205mg / 16oz
    { id: 'sbx-nitro', name: 'Nitro Cold Brew', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 17.5 }, // 280mg / 16oz
    { id: 'sbx-espresso', name: 'Espresso (Per Shot)', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 75.0 }, // 75mg / 1oz shot
    { id: 'sbx-macchiato', name: 'Iced Caramel Macchiato', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 9.38 }, // 150mg / 16oz
    { id: 'sbx-cappuccino', name: 'Cappuccino', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 9.38 }, // 150mg / 16oz
    { id: 'sbx-latte', name: 'Caffe Latte', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 9.38 }, // 150mg / 16oz
    { id: 'sbx-americano', name: 'Caffe Americano', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 14.06 }, // 225mg / 16oz
    { id: 'sbx-flat-white', name: 'Flat White', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 12.18 }, // 195mg / 16oz

    { id: 'dd-original', name: 'Original Blend', brand: "Dunkin'", category: 'coffee', caffeinePerOz: 15.0 }, // 210mg / 14oz
    { id: 'dd-midnight', name: 'Midnight Dark Roast', brand: "Dunkin'", category: 'coffee', caffeinePerOz: 11.25 }, // 180mg / 16oz
    { id: 'dd-cold-brew', name: 'Cold Brew', brand: "Dunkin'", category: 'coffee', caffeinePerOz: 10.8 }, // 260mg / 24oz
    { id: 'dd-espresso', name: 'Espresso (Per Shot)', brand: "Dunkin'", category: 'coffee', caffeinePerOz: 118.0 }, // 118mg / 1oz shot
    { id: 'dd-macchiato', name: 'Macchiato', brand: "Dunkin'", category: 'coffee', caffeinePerOz: 17.75 }, // 284mg / 16oz
    { id: 'dd-americano', name: 'Americano', brand: "Dunkin'", category: 'coffee', caffeinePerOz: 17.75 }, // 284mg / 16oz
    { id: 'dd-iced-coffee', name: 'Iced Coffee', brand: "Dunkin'", category: 'coffee', caffeinePerOz: 12.33 }, // 296mg / 24oz

    { id: 'peets-medium', name: 'Medium Roast', brand: "Peet's Coffee", category: 'coffee', caffeinePerOz: 16.68 }, // 267mg / 16oz
    { id: 'peets-dark', name: 'Dark Roast', brand: "Peet's Coffee", category: 'coffee', caffeinePerOz: 16.68 }, // 267mg / 16oz
    { id: 'peets-espresso', name: 'Espresso (Per Shot)', brand: "Peet's Coffee", category: 'coffee', caffeinePerOz: 70.0 }, // 70mg / 1.5oz double typically, but standardized per oz basis

    { id: 'mc-mccafe', name: 'McCafe Premium Roast', brand: "McDonald's", category: 'coffee', caffeinePerOz: 9.1 }, // 145mg / 16oz
    { id: 'mc-iced', name: 'Iced Coffee', brand: "McDonald's", category: 'coffee', caffeinePerOz: 8.31 }, // 133mg / 16oz
    { id: 'mc-espresso', name: 'Espresso (Per Shot)', brand: "McDonald's", category: 'coffee', caffeinePerOz: 71.0 }, // 71mg / 1oz shot
    { id: 'mc-mocha', name: 'Mocha', brand: "McDonald's", category: 'coffee', caffeinePerOz: 10.43 }, // 167mg / 16oz

    { id: 'th-original', name: 'Original Blend', brand: 'Tim Hortons', category: 'coffee', caffeinePerOz: 13.5 }, // 270mg / 20oz
    { id: 'th-dark', name: 'Dark Roast', brand: 'Tim Hortons', category: 'coffee', caffeinePerOz: 13.0 }, // 260mg / 20oz
    { id: 'th-espresso', name: 'Espresso (Per Shot)', brand: 'Tim Hortons', category: 'coffee', caffeinePerOz: 45.0 }, // ~45mg / 1oz shot

    { id: 'costa-americano', name: 'Americano', brand: 'Costa Coffee', category: 'coffee', caffeinePerOz: 17.3 }, // 277mg / 16oz

    { id: 'panera-light', name: 'Light Roast', brand: 'Panera Bread', category: 'coffee', caffeinePerOz: 18.9 }, // 303mg / 16oz
    { id: 'panera-dark', name: 'Dark Roast', brand: 'Panera Bread', category: 'coffee', caffeinePerOz: 13.3 }, // 214mg / 16oz

    { id: 'lc-cold-brew', name: 'Pure Black Cold Brew', brand: 'La Colombe', category: 'coffee', caffeinePerOz: 20.0 }, // 180mg / 9oz
    { id: 'lc-draft-latte', name: 'Draft Latte', brand: 'La Colombe', category: 'coffee', caffeinePerOz: 12.2 }, // 110mg / 9oz

    { id: 'folgers-roast', name: 'Classic Roast (Brewed)', brand: 'Folgers', category: 'coffee', caffeinePerOz: 14.0 }, // 112mg / 8oz
    { id: 'mh-house', name: 'House Blend', brand: 'Maxwell House', category: 'coffee', caffeinePerOz: 14.0 }, // 112mg / 8oz
    { id: 'nescafe-tasters', name: "Taster's Choice Instant", brand: 'Nescafe', category: 'coffee', caffeinePerOz: 8.1 }, // 65mg / 8oz
    { id: 'nespresso-original', name: 'OriginalLine Espresso', brand: 'Nespresso', category: 'coffee', caffeinePerOz: 44.4 }, // 60mg / 1.35oz
    { id: 'nespresso-vertuo', name: 'VertuoLine Coffee', brand: 'Nespresso', category: 'coffee', caffeinePerOz: 21.4 }, // 165mg / 7.7oz
    { id: 'keurig-kcup', name: 'K-Cup (Generic Medium)', brand: 'Keurig', category: 'coffee', caffeinePerOz: 12.5 }, // 100mg / 8oz
    { id: 'caribou-medium', name: 'Medium Roast', brand: 'Caribou Coffee', category: 'coffee', caffeinePerOz: 19.0 }, // 305mg / 16oz
    { id: 'db-cold-brew', name: 'Cold Brew', brand: 'Dutch Bros', category: 'coffee', caffeinePerOz: 10.6 }, // 255mg / 24oz

    // --- COFFEE: Generic Estimations ---
    { id: 'gen-drip', name: 'Drip Coffee (Generic)', brand: 'Generic', category: 'coffee', caffeinePerOz: 12.0 }, // 96mg / 8oz
    { id: 'gen-cold-brew', name: 'Cold Brew (Generic)', brand: 'Generic', category: 'coffee', caffeinePerOz: 16.0 }, // 128mg / 8oz
    { id: 'gen-espresso', name: 'Espresso (Generic, Per Shot)', brand: 'Generic', category: 'coffee', caffeinePerOz: 63.0 }, // 63mg / 1oz shot
    { id: 'gen-decaf', name: 'Decaf Coffee (Generic)', brand: 'Generic', category: 'coffee', caffeinePerOz: 0.4 }, // ~3mg / 8oz
    { id: 'gen-instant', name: 'Instant Coffee (Generic)', brand: 'Generic', category: 'coffee', caffeinePerOz: 8.0 }, // 64mg / 8oz

    // --- TEA: Brewed & Bottled ---
    { id: 'gen-black-tea', name: 'Black Tea (Brewed)', brand: 'Generic', category: 'tea', caffeinePerOz: 5.9 }, // ~47mg / 8oz
    { id: 'gen-green-tea', name: 'Green Tea (Brewed)', brand: 'Generic', category: 'tea', caffeinePerOz: 3.6 }, // ~29mg / 8oz
    { id: 'gen-white-tea', name: 'White Tea (Brewed)', brand: 'Generic', category: 'tea', caffeinePerOz: 3.5 }, // ~28mg / 8oz
    { id: 'gen-oolong-tea', name: 'Oolong Tea (Brewed)', brand: 'Generic', category: 'tea', caffeinePerOz: 4.5 }, // ~36mg / 8oz
    { id: 'gen-matcha', name: 'Matcha (Prepared)', brand: 'Generic', category: 'tea', caffeinePerOz: 8.8 }, // ~70mg / 8oz
    { id: 'gen-chai', name: 'Chai Tea (Brewed)', brand: 'Generic', category: 'tea', caffeinePerOz: 6.3 }, // ~50mg / 8oz
    { id: 'gen-yerba', name: 'Yerba Mate (Brewed)', brand: 'Generic', category: 'tea', caffeinePerOz: 10.6 }, // ~85mg / 8oz

    { id: 'lipton-black', name: 'Black Tea (Brewed)', brand: 'Lipton', category: 'tea', caffeinePerOz: 6.8 }, // 55mg / 8oz
    { id: 'lipton-iced', name: 'Iced Tea (Bottled)', brand: 'Lipton', category: 'tea', caffeinePerOz: 1.5 }, // 25mg / 16.9oz
    { id: 'pure-leaf', name: 'Unsweetened Iced Tea', brand: 'Pure Leaf', category: 'tea', caffeinePerOz: 3.73 }, // 69mg / 18.5oz
    { id: 'arizona-iced', name: 'Iced Tea (Bottled)', brand: 'Arizona', category: 'tea', caffeinePerOz: 1.5 }, // 24mg / 16oz
    { id: 'snapple-sweet', name: 'Sweet Tea', brand: 'Snapple', category: 'tea', caffeinePerOz: 1.0 }, // 12mg / 12oz
    { id: 'snapple-flavor', name: 'Flavored Teas', brand: 'Snapple', category: 'tea', caffeinePerOz: 2.6 }, // 31.5mg / 12oz

    { id: 'sbx-tea-black', name: 'Teavana Iced Black Tea', brand: 'Starbucks', category: 'tea', caffeinePerOz: 3.1 }, // 50mg / 16oz
    { id: 'sbx-tea-green', name: 'Teavana Iced Green Tea', brand: 'Starbucks', category: 'tea', caffeinePerOz: 2.5 }, // 40mg / 16oz
    { id: 'sbx-chai-latte', name: 'Chai Tea Latte', brand: 'Starbucks', category: 'tea', caffeinePerOz: 5.9 }, // 95mg / 16oz
    { id: 'sbx-matcha-latte', name: 'Matcha Tea Latte', brand: 'Starbucks', category: 'tea', caffeinePerOz: 5.0 }, // 80mg / 16oz
    { id: 'guayaki-yerba', name: 'Yerba Mate', brand: 'Guayaki', category: 'tea', caffeinePerOz: 9.3 }, // 150mg / 16oz

    // --- ENERGY DRINKS & SHOTS ---
    { id: 'redbull-og', name: 'Energy Drink', brand: 'Red Bull', category: 'energy', caffeinePerOz: 9.5 }, // 80mg / 8.4oz
    { id: 'redbull-sf', name: 'Sugar Free', brand: 'Red Bull', category: 'energy', caffeinePerOz: 9.5 }, // 80mg / 8.4oz

    { id: 'monster-og', name: 'Energy Drink', brand: 'Monster', category: 'energy', caffeinePerOz: 10.0 }, // 160mg / 16oz
    { id: 'monster-ultra', name: 'Zero Ultra', brand: 'Monster', category: 'energy', caffeinePerOz: 10.0 }, // 160mg / 16oz
    { id: 'reign-total', name: 'Total Body Fuel', brand: 'Reign', category: 'energy', caffeinePerOz: 18.75 }, // 300mg / 16oz

    { id: 'celsius-og', name: 'Fitness Drink (Original)', brand: 'Celsius', category: 'energy', caffeinePerOz: 16.67 }, // 200mg / 12oz
    { id: 'celsius-heat', name: 'Heat', brand: 'Celsius', category: 'energy', caffeinePerOz: 25.0 }, // 300mg / 12oz
    { id: 'celsius-essentials', name: 'Essentials', brand: 'Celsius', category: 'energy', caffeinePerOz: 16.88 }, // 270mg / 16oz

    { id: 'rockstar-og', name: 'Energy Drink', brand: 'Rockstar', category: 'energy', caffeinePerOz: 10.0 }, // 160mg / 16oz
    { id: 'rockstar-zero', name: 'Pure Zero', brand: 'Rockstar', category: 'energy', caffeinePerOz: 15.0 }, // 240mg / 16oz
    { id: 'rockstar-punched', name: 'Punched', brand: 'Rockstar', category: 'energy', caffeinePerOz: 15.0 }, // 240mg / 16oz

    { id: 'bang-energy', name: 'Bang Energy', brand: 'Bang', category: 'energy', caffeinePerOz: 18.75 }, // 300mg / 16oz

    { id: 'c4-performance', name: 'Performance Energy', brand: 'C4', category: 'energy', caffeinePerOz: 12.5 }, // 200mg / 16oz
    { id: 'c4-ultimate', name: 'Ultimate', brand: 'C4', category: 'energy', caffeinePerOz: 25.0 }, // 300mg / 12oz

    { id: 'ghost-energy', name: 'Energy Drink', brand: 'Ghost', category: 'energy', caffeinePerOz: 12.5 }, // 200mg / 16oz
    { id: 'prime-energy', name: 'Energy Drink', brand: 'Prime', category: 'energy', caffeinePerOz: 16.67 }, // 200mg / 12oz

    { id: '5hour-regular', name: 'Energy Shot (Regular)', brand: '5-Hour Energy', category: 'energy', caffeinePerOz: 103.62 }, // 200mg / 1.93oz
    { id: '5hour-extra', name: 'Energy Shot (Extra Strength)', brand: '5-Hour Energy', category: 'energy', caffeinePerOz: 119.17 }, // 230mg / 1.93oz

    { id: 'nos-energy', name: 'Energy Drink', brand: 'NOS', category: 'energy', caffeinePerOz: 10.0 }, // 160mg / 16oz
    { id: 'full-throttle', name: 'Energy Drink', brand: 'Full Throttle', category: 'energy', caffeinePerOz: 10.0 }, // 160mg / 16oz
    { id: 'amp-energy', name: 'Energy Drink', brand: 'Amp Energy', category: 'energy', caffeinePerOz: 8.88 }, // 142mg / 16oz
    { id: 'venom-energy', name: 'Energy Drink', brand: 'Venom', category: 'energy', caffeinePerOz: 10.0 }, // 160mg / 16oz
    { id: 'uptime-energy', name: 'Energy Drink', brand: 'Uptime Energy', category: 'energy', caffeinePerOz: 11.83 }, // 142mg / 12oz
    { id: 'zoa-energy', name: 'Energy Drink', brand: 'ZOA', category: 'energy', caffeinePerOz: 10.0 }, // 160mg / 16oz
    { id: 'ryse-energy', name: 'Energy Drink', brand: 'Ryse', category: 'energy', caffeinePerOz: 12.5 }, // 200mg / 16oz
    { id: 'alani-nu', name: 'Energy Drink', brand: 'Alani Nu', category: 'energy', caffeinePerOz: 16.67 }, // 200mg / 12oz

    // --- SODAS ---
    { id: 'coke-og', name: 'Coca-Cola (Original)', brand: 'Coca-Cola', category: 'soda', caffeinePerOz: 2.83 }, // 34mg / 12oz
    { id: 'coke-zero', name: 'Coke Zero Sugar', brand: 'Coca-Cola', category: 'soda', caffeinePerOz: 2.83 }, // 34mg / 12oz
    { id: 'diet-coke', name: 'Diet Coke', brand: 'Coca-Cola', category: 'soda', caffeinePerOz: 3.83 }, // 46mg / 12oz
    { id: 'cherry-coke', name: 'Cherry Coke', brand: 'Coca-Cola', category: 'soda', caffeinePerOz: 2.83 }, // 34mg / 12oz
    { id: 'mello-yello', name: 'Mello Yello', brand: 'Coca-Cola', category: 'soda', caffeinePerOz: 4.4 }, // 52.8mg / 12oz
    { id: 'pibb-xtra', name: 'Pibb Xtra', brand: 'Coca-Cola', category: 'soda', caffeinePerOz: 3.33 }, // 40mg / 12oz
    { id: 'barqs-rootbeer', name: "Barq's Root Beer", brand: 'Coca-Cola', category: 'soda', caffeinePerOz: 1.92 }, // 23mg / 12oz

    { id: 'pepsi-og', name: 'Pepsi', brand: 'PepsiCo', category: 'soda', caffeinePerOz: 3.17 }, // 38mg / 12oz
    { id: 'diet-pepsi', name: 'Diet Pepsi', brand: 'PepsiCo', category: 'soda', caffeinePerOz: 2.92 }, // 35mg / 12oz
    { id: 'pepsi-zero', name: 'Pepsi Zero Sugar', brand: 'PepsiCo', category: 'soda', caffeinePerOz: 5.75 }, // 69mg / 12oz
    { id: 'mtn-dew', name: 'Mountain Dew', brand: 'PepsiCo', category: 'soda', caffeinePerOz: 4.5 }, // 54mg / 12oz
    { id: 'diet-mtn-dew', name: 'Diet Mountain Dew', brand: 'PepsiCo', category: 'soda', caffeinePerOz: 4.5 }, // 54mg / 12oz
    { id: 'mtn-dew-baja', name: 'Mountain Dew Baja Blast', brand: 'PepsiCo', category: 'soda', caffeinePerOz: 4.5 }, // 54mg / 12oz
    { id: 'mtn-dew-code-red', name: 'Mountain Dew Code Red', brand: 'PepsiCo', category: 'soda', caffeinePerOz: 4.5 }, // 54mg / 12oz

    { id: 'dr-pepper', name: 'Dr Pepper', brand: 'Keurig Dr Pepper', category: 'soda', caffeinePerOz: 3.42 }, // 41mg / 12oz
    { id: 'diet-dr-pepper', name: 'Diet Dr Pepper', brand: 'Keurig Dr Pepper', category: 'soda', caffeinePerOz: 3.42 }, // 41mg / 12oz
    { id: 'sunkist-orange', name: 'Sunkist Orange', brand: 'Keurig Dr Pepper', category: 'soda', caffeinePerOz: 3.33 }, // 40mg / 12oz
    { id: 'diet-sunkist', name: 'Diet Sunkist Orange', brand: 'Keurig Dr Pepper', category: 'soda', caffeinePerOz: 3.42 }, // 41mg / 12oz
    { id: 'aw-creme', name: 'A&W Creme Soda', brand: 'Keurig Dr Pepper', category: 'soda', caffeinePerOz: 2.42 }, // 29mg / 12oz
    { id: 'aw-diet-creme', name: 'A&W Diet Creme Soda', brand: 'Keurig Dr Pepper', category: 'soda', caffeinePerOz: 1.83 }, // 22mg / 12oz
    { id: 'rc-cola', name: 'RC Cola', brand: 'Keurig Dr Pepper', category: 'soda', caffeinePerOz: 3.58 }, // 43mg / 12oz

    { id: 'shasta-cola', name: 'Shasta Cola', brand: 'Shasta', category: 'soda', caffeinePerOz: 3.7 }, // 44.4mg / 12oz
    { id: 'jolt-cola', name: 'Jolt Cola', brand: 'Jolt', category: 'soda', caffeinePerOz: 5.93 }, // 71mg / 12oz
    { id: 'bawls-guarana', name: 'Guarana', brand: 'Bawls', category: 'soda', caffeinePerOz: 6.4 }, // 64mg / 10oz
];

export const COMMON_SIZES = [
    { label: '8 oz (Short/Small)', value: 8 },
    { label: '12 oz (Tall/Standard)', value: 12 },
    { label: '16 oz (Grande/Medium)', value: 16 },
    { label: '20 oz (Venti Hot/Large)', value: 20 },
    { label: '24 oz (Venti Iced)', value: 24 },
    { label: '30 oz (Trenta/Tumbler)', value: 30 },
    { label: '40 oz (Large Tumbler)', value: 40 },
];

export const ICE_MODIFIERS = [
    { label: 'No Ice', value: 1.0, description: '100% liquid volume' },
    { label: 'Light Ice', value: 0.85, description: '~85% liquid volume' },
    { label: 'Standard Ice', value: 0.7, description: '~70% liquid volume' },
    { label: 'Extra Ice', value: 0.5, description: '~50% liquid volume (Cup full of ice)' },
];
