# Cannavigia API: what is public (checked 17 November 2026)

Sources read in full:
- https://info.cannavigia.com/cannavigia-manual/English/connect-api
- https://info.cannavigia.com/cannavigia-manual/English/connectapi-documentation
- Manual pages "Integrations", "Product Pass", "Reports"
- https://www.cannavigia.com/productpass-module

## The Connect API ("Open API")

- **Purpose:** push environmental sensor data from IoT devices into Cannavigia. Nothing else.
- **Base URL:** `https://connectapi.iot.cannavigia.io/v1`
- **Auth:** `Authorization: Bearer <token>`; tokens are created per account under Settings → Integrations → Manage API Tokens.
- **Endpoints (POST only):** `/iot_temp` (°C), `/iot_humidity` (%), `/iot_co2` (ppm).
- **Payload:** `sensor_guid`, `sensor_timestamp` (UTC), `sensor_value`. Devices are created first under Facility → IoT Devices.
- **Errors:** 400, 401, 404, 500. **Rate limit:** 1000 requests/minute (429 above).
- No read endpoints, no webhooks, no pagination, no sandbox mentioned.

## What KYP would need, and whether it exists publicly

| KYP needs | Public API? |
| --- | --- |
| Batches / lots (number, product, cultivar, dates, origin, status) | No |
| Lab results / COA (cannabinoids, terpenes, contaminants, lab, date, document) | No |
| Events / chain of custody (harvest, processing, packaging, delivery) | No |
| Organisations, licences | No |
| Product Pass data or its public page as JSON | No |
| Change notifications (webhooks) | No |
| Direction | Connect API is write-only into Cannavigia; KYP needs to read out |

The Product Pass module already assembles the right data per batch inside Cannavigia (genetics with cannabinoid/terpene profile, cultivation inputs and tasks, post-harvest records, manufacturing/packaging, attached COAs, QR export), with the operator choosing which fields are visible. It is exposed as a QR landing page, not as an API.

## Consequence for KYP

`import_event` in KYP has no public Cannavigia source to call. Options: a read API from Cannavigia (batch, lab result and event endpoints, ideally with webhooks), a scheduled export (CSV/JSON) per batch, or Product Pass data offered as JSON. All need Cannavigia to build or open something; the manual names Customer Success as the contact.
