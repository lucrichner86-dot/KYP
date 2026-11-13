// Row shapes, written by hand to match supabase/migrations.

export type BatchStatus = 'draft' | 'published' | 'recalled'
export type ProductType = 'flower' | 'extract' | 'other'
export type ItemKind = 'cannabinoid' | 'terpene' | 'contaminant'
export type JourneyStage =
  | 'cultivation'
  | 'harvest'
  | 'processing'
  | 'testing'
  | 'packaging'
  | 'distribution'
  | 'dispensing'

export interface Producer {
  id: string
  name: string
  country: string
  website: string | null
}

export interface Product {
  id: string
  producer_id: string
  name: string
  product_type: ProductType
  cultivar: string | null
  description: string | null
}

export interface LabItem {
  kind: ItemKind
  name: string
  value: number | null
  unit: string | null
  passed: boolean | null
}

export interface LabResult {
  id: string
  lab_name: string
  test_date: string
  coa_url: string | null
  items: (LabItem & { id: string; sort_order: number })[]
}

export interface JourneyStep {
  id: string
  stage: JourneyStage
  place: string
  step_date: string
  created_at: string
}

export interface Batch {
  id: string
  producer_id: string
  product_id: string
  batch_number: string
  harvest_date: string | null
  packaging_date: string | null
  origin_grower: string | null
  origin_place: string | null
  origin_country: string | null
  status: BatchStatus
  recall_note: string | null
  passport_code: string
  source: 'manual' | 'cannavigia'
  created_at: string
  published_at: string | null
  recalled_at: string | null
}

export interface BatchListRow extends Batch {
  product: { name: string } | null
}

export interface BatchDetail extends Batch {
  product: Product | null
  lab_results: LabResult[]
  journey_steps: JourneyStep[]
}

// What get_passport(code) returns: the public view of one batch.
export interface Passport {
  code: string
  status: 'published' | 'recalled'
  recall_note: string | null
  published_at: string
  recalled_at: string | null
  source: 'manual' | 'cannavigia'
  batch_number: string
  harvest_date: string | null
  packaging_date: string | null
  origin_grower: string | null
  origin_place: string | null
  origin_country: string | null
  product: Pick<Product, 'name' | 'product_type' | 'cultivar' | 'description'>
  producer: Pick<Producer, 'name' | 'country' | 'website'>
  lab_results: { lab_name: string; test_date: string; coa_url: string | null; items: LabItem[] }[]
  journey: { stage: JourneyStage; place: string; step_date: string }[]
}
