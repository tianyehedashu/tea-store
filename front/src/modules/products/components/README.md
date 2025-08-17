# Tea Product Detail Components

This directory contains specialized components for displaying detailed tea product information, inspired by the Matchaeologist website's interactive design.

## Overview

The tea detail system automatically detects tea products and provides rich, educational content organized in expandable sections. It's designed to enhance the user experience by providing comprehensive tea information in an elegant, easy-to-navigate format.

## Components

### Core Components

- **TeaBasicInfo** - Tea category, origin, and terroir information
- **TeaProductionInfo** - Harvest details and processing craftsmanship  
- **TeaStorageGuide** - Storage requirements and container recommendations
- **TeaBrewingGuide** - Detailed brewing instructions and techniques
- **TeaToolsRecommend** - Tea tool and accessory recommendations
- **TeaHealthBenefits** - Nutritional information and health benefits
- **TeaCultureStory** - Brand story, culture, and heritage content

### Template Components

- **TeaProductTemplate** - Main template that intelligently detects tea products
- **TeaProductTabs** - Accordion-style tabs that organize tea information

## Product Detection

The system automatically detects tea products using multiple criteria:

1. **Metadata**: Checks for `tea_type` field
2. **Product Type**: Looks for "tea" in product type
3. **Categories**: Searches tea-related categories
4. **Collections**: Checks collection handles for tea keywords
5. **Content**: Analyzes title/description for tea keywords

## Metadata Structure

Each component reads specific metadata fields from the product. Here's the expected structure:

### Basic Info
```typescript
{
  tea_type: "green" | "black" | "white" | "oolong" | "puer" | "dark" | "yellow" | "flower" | "herbal",
  tea_category: string,
  origin_province: string,
  origin_region: string,
  origin_altitude: string,
  origin_climate: string,
  origin_soil: string,
  origin_history: string,
  geographic_description: string
}
```

### Production Info
```typescript
{
  harvest_season: "pre-qingming" | "post-qingming" | "pre-guyu" | "post-guyu" | "summer" | "autumn" | "winter",
  harvest_standard: "bud-only" | "one-bud-one-leaf" | "one-bud-two-leaves" | "one-bud-three-leaves" | "mature-leaves",
  processing_methods: string[],
  vintage_year: string,
  aging_period: string,
  processing_master: string,
  harvest_date: string,
  leaf_grade: string,
  oxidation_level: string,
  fermentation_type: string,
  drying_method: string,
  roasting_level: string
}
```

### Storage Guide
```typescript
{
  shelf_life: string,
  storage_temperature: string,
  storage_humidity: string,
  storage_light: string,
  storage_air: string,
  storage_container: string[],
  storage_environment: string,
  storage_notes: string,
  recommended_containers: string[],
  avoid_storage: string[]
}
```

### Brewing Guide
```typescript
{
  water_temperature: number,
  water_quality: string,
  tea_to_water_ratio: string,
  steeping_times: Array<{
    round: number,
    time_seconds: number,
    note?: string
  }>,
  brewing_steps: string[],
  vessel_recommendations: string[],
  advanced_techniques: string,
  tasting_notes: string[],
  optimal_servings: number,
  water_volume: string
}
```

### Health Benefits
```typescript
{
  active_compounds: Array<{
    name: string,
    content?: string,
    benefits?: string[]
  }>,
  health_benefits: Array<{
    category: string,
    benefits: string[],
    scientific_evidence?: string
  }>,
  nutritional_info: {
    caffeine_mg_per_cup?: number,
    antioxidants?: string,
    vitamins?: string[],
    minerals?: string[],
    calories_per_cup?: number
  },
  contraindications: string[],
  suitable_for: string[],
  not_suitable_for: string[],
  daily_consumption_limit: string,
  special_notes: string
}
```

### Culture & Story
```typescript
{
  brand_story: string,
  tea_tradition: {
    history?: string,
    cultural_significance?: string,
    legends?: string[],
    ceremonies?: string[]
  },
  farm_story: {
    farm_name?: string,
    farmer_story?: string,
    farming_philosophy?: string,
    sustainable_practices?: string[],
    farm_images?: string[]
  },
  celebrity_endorsements: Array<{
    person: string,
    quote: string,
    context?: string
  }>,
  cultural_moments: Array<{
    title: string,
    description: string,
    historical_period?: string
  }>,
  tea_master_profile: {
    name?: string,
    experience?: string,
    philosophy?: string,
    awards?: string[],
    photo?: string
  },
  tea_education: {
    origin_facts?: string[],
    cultural_etiquette?: string[],
    seasonal_significance?: string
  }
}
```

## Design Philosophy

The components follow these design principles:

1. **Educational Focus** - Each section provides educational value beyond basic product information
2. **Cultural Respect** - Honors tea traditions and cultural significance
3. **Practical Guidance** - Offers actionable advice for tea preparation and enjoyment
4. **Visual Hierarchy** - Uses colors, icons, and typography to create clear information hierarchy
5. **Responsive Design** - Adapts to different screen sizes and devices
6. **Accessibility** - Includes proper semantic markup and keyboard navigation

## Color Scheme

The components use a carefully chosen color palette:

- **Brand Green** (`brand-*`) - Primary tea-related content
- **Sage** (`sage-*`) - Harvest and natural elements
- **Cream** (`cream-*`) - Processing and craftsmanship
- **Blue** (`blue-*`) - Storage and care instructions
- **Purple** (`purple-*`) - Tools and accessories
- **Amber** (`amber-*`) - Cultural and traditional content
- **Red/Green** (`red-*/green-*`) - Health benefits and warnings

## Usage Example

```tsx
import TeaProductTemplate from '@modules/products/templates/tea-product-template'

// The template automatically detects tea products and renders accordingly
<TeaProductTemplate 
  product={product} 
  region={region} 
  countryCode={countryCode} 
/>
```

## Integration

The tea components are automatically integrated through the main `ProductTemplate` component, which detects tea products and switches to the tea-specific layout. No additional configuration is required - just ensure your tea products have the appropriate metadata fields populated.
