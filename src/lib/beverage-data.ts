export type BeverageCategory = 'coffee' | 'tea' | 'energy' | 'soda' | 'other';

export interface Beverage {
    id: string;
    name: string;
    brand: string;
    category: BeverageCategory;
    caffeinePerOz: number;
}

export const BEVERAGE_DATABASE: Beverage[] = [
    // Coffee Shop Standards (estimates per oz based on typical brews)
    { id: 'sbx-pike', name: 'Pike Place Roast', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 19.4 }, // ~310mg in 16oz
    { id: 'sbx-cold-brew', name: 'Cold Brew', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 12.8 }, // ~205mg in 16oz
    { id: 'sbx-nitro', name: 'Nitro Cold Brew', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 17.5 }, // ~280mg in 16oz
    { id: 'sbx-espresso', name: 'Espresso (Per Shot)', brand: 'Starbucks', category: 'coffee', caffeinePerOz: 75 }, // ~75mg per 1oz shot

    { id: 'dd-original', name: 'Original Blend', brand: "Dunkin'", category: 'coffee', caffeinePerOz: 15 }, // ~210mg in 14oz
    { id: 'dd-cold-brew', name: 'Cold Brew', brand: "Dunkin'", category: 'coffee', caffeinePerOz: 10.8 }, // ~260mg in 24oz

    { id: 'lc-cold-brew', name: 'Pure Black Cold Brew', brand: 'La Colombe', category: 'coffee', caffeinePerOz: 20 }, // ~180mg in 9oz, ~220mg in 11oz

    { id: 'mc-mccafe', name: 'Premium Roast Coffee', brand: 'McDonalds', category: 'coffee', caffeinePerOz: 9.1 }, // ~145mg in 16oz

    // Generic Coffee/Tea
    { id: 'gen-drip', name: 'Drip Coffee (Generic)', brand: 'Generic', category: 'coffee', caffeinePerOz: 12 }, // ~95mg in 8oz
    { id: 'gen-cold-brew', name: 'Cold Brew (Generic)', brand: 'Generic', category: 'coffee', caffeinePerOz: 16 }, // Generic strong cold brew estimate
    { id: 'gen-espresso', name: 'Espresso (Generic, Per Shot)', brand: 'Generic', category: 'coffee', caffeinePerOz: 63 }, // ~63mg per 1oz shot
    { id: 'gen-black-tea', name: 'Black Tea', brand: 'Generic', category: 'tea', caffeinePerOz: 5.9 }, // ~47mg in 8oz
    { id: 'gen-green-tea', name: 'Green Tea', brand: 'Generic', category: 'tea', caffeinePerOz: 3.6 }, // ~29mg in 8oz
    { id: 'gen-matcha', name: 'Matcha (Prepared)', brand: 'Generic', category: 'tea', caffeinePerOz: 8.8 }, // ~70mg in 8oz
    { id: 'gen-chai', name: 'Chai Tea', brand: 'Generic', category: 'tea', caffeinePerOz: 6.3 }, // ~50mg in 8oz

    // Energy Drinks (Standard Cans)
    { id: 'redbull-og', name: 'Energy Drink', brand: 'Red Bull', category: 'energy', caffeinePerOz: 9.5 }, // 80mg in 8.4oz
    { id: 'monster-og', name: 'Energy Drink', brand: 'Monster', category: 'energy', caffeinePerOz: 10 }, // 160mg in 16oz
    { id: 'celsius-og', name: 'Fitness Drink', brand: 'Celsius', category: 'energy', caffeinePerOz: 16.7 }, // 200mg in 12oz
    { id: 'ghost-energy', name: 'Energy Drink', brand: 'Ghost', category: 'energy', caffeinePerOz: 12.5 }, // 200mg in 16oz

    // Sodas
    { id: 'coke-og', name: 'Coca-Cola', brand: 'Coca-Cola', category: 'soda', caffeinePerOz: 2.8 }, // 34mg in 12oz
    { id: 'diet-coke', name: 'Diet Coke', brand: 'Coca-Cola', category: 'soda', caffeinePerOz: 3.8 }, // 46mg in 12oz
    { id: 'pepsi-og', name: 'Pepsi', brand: 'Pepsi', category: 'soda', caffeinePerOz: 3.2 }, // 38mg in 12oz
    { id: 'dr-pepper', name: 'Dr Pepper', brand: 'Dr Pepper', category: 'soda', caffeinePerOz: 3.4 }, // 41mg in 12oz
    { id: 'mtn-dew', name: 'Mountain Dew', brand: 'PepsiCo', category: 'soda', caffeinePerOz: 4.5 }, // 54mg in 12oz
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
