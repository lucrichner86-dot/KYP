import { supabase } from './supabase'
import type { BatchDetail, BatchListRow, JourneyStage, LabItem, Producer, Product, ProductType } from './types'

// Reads go straight to the tables (row level security limits them to the
// signed-in member's producer). Every change is a database function.

function check<T>(result: { data: T; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message)
  return result.data
}

// ------------------------------------------------------------------ reads

export async function fetchMyProducer(): Promise<Producer | null> {
  return check(await supabase.from('producers').select('id, name, country, website').limit(1).maybeSingle())
}

export async function fetchProducts(): Promise<Product[]> {
  return check(await supabase.from('products').select('*').order('created_at')) ?? []
}

export async function fetchBatches(): Promise<BatchListRow[]> {
  return (
    (check(
      await supabase.from('batches').select('*, product:products(name)').order('created_at', { ascending: false }),
    ) as BatchListRow[] | null) ?? []
  )
}

export async function fetchBatch(id: string): Promise<BatchDetail | null> {
  const batch = check(
    await supabase
      .from('batches')
      .select('*, product:products(*), lab_results(*, items:lab_result_items(*)), journey_steps(*)')
      .eq('id', id)
      .maybeSingle(),
  ) as BatchDetail | null
  if (!batch) return null
  batch.lab_results.sort((a, b) => b.test_date.localeCompare(a.test_date))
  batch.lab_results.forEach((r) => r.items.sort((a, b) => a.sort_order - b.sort_order))
  batch.journey_steps.sort(
    (a, b) => a.step_date.localeCompare(b.step_date) || a.created_at.localeCompare(b.created_at),
  )
  return batch
}

export async function fetchScanCount(batchId: string): Promise<number> {
  const { count, error } = await supabase
    .from('scan_log')
    .select('id', { count: 'exact', head: true })
    .eq('batch_id', batchId)
  if (error) throw new Error(error.message)
  return count ?? 0
}

// ---------------------------------------------------------------- changes

export async function createProducer(name: string, country: string, website: string): Promise<string> {
  return check(await supabase.rpc('create_producer', { p_name: name, p_country: country, p_website: website }))
}

export async function addProduct(input: {
  producerId: string
  name: string
  productType: ProductType
  cultivar: string
  description: string
}): Promise<string> {
  return check(
    await supabase.rpc('add_product', {
      p_producer_id: input.producerId,
      p_name: input.name,
      p_product_type: input.productType,
      p_cultivar: input.cultivar,
      p_description: input.description,
    }),
  )
}

export async function createBatch(input: {
  productId: string
  batchNumber: string
  harvestDate: string
  packagingDate: string
  originGrower: string
  originPlace: string
  originCountry: string
}): Promise<string> {
  return check(
    await supabase.rpc('create_batch', {
      p_product_id: input.productId,
      p_batch_number: input.batchNumber,
      p_harvest_date: input.harvestDate || null,
      p_packaging_date: input.packagingDate || null,
      p_origin_grower: input.originGrower,
      p_origin_place: input.originPlace,
      p_origin_country: input.originCountry,
    }),
  )
}

export async function addLabResult(input: {
  batchId: string
  labName: string
  testDate: string
  coaUrl: string
  items: LabItem[]
}): Promise<void> {
  check(
    await supabase.rpc('add_lab_result', {
      p_batch_id: input.batchId,
      p_lab_name: input.labName,
      p_test_date: input.testDate,
      p_coa_url: input.coaUrl,
      p_items: input.items,
    }),
  )
}

export async function removeLabResult(id: string): Promise<void> {
  check(await supabase.rpc('remove_lab_result', { p_lab_result_id: id }))
}

export async function addJourneyStep(
  batchId: string,
  stage: JourneyStage,
  place: string,
  stepDate: string,
): Promise<void> {
  check(
    await supabase.rpc('add_journey_step', {
      p_batch_id: batchId,
      p_stage: stage,
      p_place: place,
      p_step_date: stepDate,
    }),
  )
}

export async function removeJourneyStep(id: string): Promise<void> {
  check(await supabase.rpc('remove_journey_step', { p_journey_step_id: id }))
}

export async function publishBatch(id: string): Promise<void> {
  check(await supabase.rpc('publish_batch', { p_batch_id: id }))
}

export async function recallBatch(id: string, note: string): Promise<void> {
  check(await supabase.rpc('recall_batch', { p_batch_id: id, p_note: note }))
}
