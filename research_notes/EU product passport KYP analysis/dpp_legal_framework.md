# EU Digital Product Passport (DPP): legal framework and implementation status as of 13 November 2026

> **Method note for the report writer.** In this session only web *search* worked; direct page fetches (EUR-Lex, cencenelec.eu, Commission pages, vendor blogs) were blocked by the network allowlist. Consequences:
> - 2026 developments below rest on search-result summaries of law-firm notes (CMS), Commission news items, trade bodies and vendor trackers. Where only vendor blogs support a point, it is flagged "secondary only".
> - Article-level descriptions of ESPR (Arts 1, 9-15, 27-38, 74) are written from the adopted text of Regulation (EU) 2024/1781 as known to the researcher and linked to the EUR-Lex ELI, but were **not re-read against EUR-Lex in this session**. Paragraph numbers should be spot-checked before quoting in anything external.
> - Status labels used: **[IN FORCE/APPLICABLE]**, **[ADOPTED, NOT YET APPLICABLE]**, **[DRAFT/EXPECTED]**, **[DELAYED]**, **[UNCONFIRMED]**.

---

## 1. What ESPR (Regulation (EU) 2024/1781) says about the DPP (Articles 9-15)

### Takeaway
ESPR is a framework law: it defines the DPP architecture (data carrier + unique identifiers + decentralised data + central registry + customs check + mandatory backup copy at a third-party DPP service provider), but **no product needs an ESPR passport until a product-specific delegated act says so**. As of November 2026 the architecture is partly live (registry) while no ESPR delegated act imposing a passport on any product group has been adopted.

### Cited Findings
- ESPR is Regulation (EU) 2024/1781; it entered into force 18 July 2024 and replaced the Ecodesign Directive 2009/125/EC framework. **[IN FORCE]** — [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Articles 9 to 15 set the core DPP rules; each delegated act decides which products need a passport and, per Art 9(2)(a), specifies "the data to be included in the digital product passport pursuant to Annex III". — [sorena guide, via search](https://sorena-io.pages.dev/artifacts/eu/digital-product-passport/what-is-a-dpp); [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Art 9 (from the regulation text, not re-fetched): products covered by a delegated act may only be placed on the market or put into service if a DPP is available; the delegated act fixes (i) the data, (ii) the data-carrier type(s), (iii) layout and position of the carrier, (iv) the granularity level — model, batch or item, (v) how the passport is made accessible to customers before purchase including distance selling, (vi) which actors get access to which data, (vii) which actors may create or update data, (viii) how long the passport must stay available. Art 9(4) lets the Commission exempt product groups where another Union law already provides an equivalent digital information system. — [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Annex III data categories (from the regulation text): unique product identifier; Global Trade Identification Number (ISO/IEC 15459-6 or equivalent); commodity/TARIC codes; compliance documentation (declaration of conformity, technical documentation, certificates); user manuals, instructions, warnings, safety information; manufacturer information including unique operator identifier; unique facility identifiers; importer information incl. EORI; EU-established economic operator responsible. Product-specific sustainability data (substances of concern, recycled content, carbon/environmental footprint, durability, reparability) comes from the Annex I parameters as selected per delegated act. — [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Art 10 (from the regulation text): the passport must be linked via a data carrier to a persistent unique product identifier; the carrier must be physically on the product, its packaging or accompanying documentation; carrier and identifiers must comply with ISO/IEC 15459:2015 or equivalent; data must be based on open standards, interoperable, machine-readable, structured, searchable and transferable "without vendor lock-in"; customer personal data may not be stored in the passport without explicit consent. — [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- **Backup copy:** operators may host the passport themselves, but for in-scope products they must also make a backup copy available through a DPP service provider. — [bdemerson, via search](https://www.bdemerson.com/article/digital-product-passport); regulation basis Art 10(4), [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- ESPR defines a DPP service provider (Art 2(32)) as an independent third party authorised by the responsible economic operator to process passport data; passports must remain available for the period set per product group even if the operator ceases trading or becomes insolvent. — [PLM Vendors, via search](https://www.plmvendors.com/knowledge/digital-product-passport/); [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Art 11 empowers the Commission to set by delegated act: (a) requirements providers must meet to become DPP service providers; (b) where appropriate, a certification scheme to verify compliance; (c) requirements when providing DPP services. — [infodpp, via search](https://infodpp.eu/en/blog/dpp-service-provider-requirements-eu/)
- Art 11 also (from the regulation text): free access for consumers, operators and other actors according to their access rights; data stored by the responsible economic operator or its service provider; a service provider may not sell, reuse or process the data beyond what the service requires; rights to add or modify data are restricted per delegated act; data authentication, reliability and integrity must be ensured. — [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Art 12: unique operator identifiers and unique facility identifiers must comply with the standards referenced in Annex III or equivalent. — [sorena requirements guide, via search](https://sorena-io.pages.dev/artifacts/eu/digital-product-passport/requirements)
- Art 13(1) requires the Commission to set up a registry storing securely at least the unique identifiers; deadline 19 July 2026. The registry holds identifiers, registration data and key metadata — not the passport content, which stays with the business or its DPP service provider. — [GS1 UK](https://www.gs1uk.org/insights/news/EU-Digital-Product-Passport-Registry-goes-live); [CMS](https://cms.law/en/int/legal-updates/key-development-in-the-eu-digital-product-passport-launch-of-the-dpp-registry)
- The registry design includes a reference list of DPP service providers that host backup copies. — [WKO copy of Commission "Have Your Say" registry draft, April 2026](https://content.wko.at/ooe/Branchen/Industrie/Zusendungen/20260430%20HyS%20-%20DPP%20Registry.pdf)
- Art 14 (from the regulation text): the Commission must set up a public web portal letting stakeholders search and compare data in passports, in line with their access rights. — [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Art 15 (customs): once the registry is operational, goods declared for release for free circulation need the unique registration identifier; customs can verify identifier plus commodity code "electronically and automatically". One source says the registry will be linked to the EU Customs Single Window. — [sorena requirements guide, via search](https://sorena-io.pages.dev/artifacts/eu/digital-product-passport/requirements); [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Access is tiered: a public layer for consumers, restricted layers for authorities (market surveillance, customs, Commission) and for parties with a "legitimate interest" (repairers, recyclers), defined per delegated act; market surveillance authorities can scan the carrier and access passport data directly. — [esprregistry penalties page, via search](https://esprregistry.pages.dev/espr-penalties-enforcement); [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)

### Inferences
- ESPR creates a legally mandated role for an independent third party (backup host, potentially certified) alongside the brand owner's own system. That role, not the registry, is where a provenance company plugs in. The certification regime for that role does not yet exist (see section 5).
- The registry is a pointer/identifier index plus a customs gate. It does not verify the truth of passport content; the automated checks are on structure and completeness only (see section 5). Content assurance is therefore an open commercial space.
- "No vendor lock-in" plus open standards means the DPP data layer is designed to be commoditised; differentiation has to come from verification, evidence and sector expertise rather than from hosting.

### Gaps
- Exact paragraph numbering and verbatim wording of Arts 9-15 could not be re-verified against EUR-Lex this session (host blocked).
- Whether the Art 14 web portal is live: no source found. Treat as **[UNCONFIRMED]**.
- Whether the Art 15 customs check is technically switched on: sources only state the legal design. Since no product group has a passport duty yet, there is nothing for customs to check under ESPR today.

---

## 2. ESPR working plan 2025-2030: priority product groups, dates, and what actually happened

### Takeaway
The working plan (adopted 16 April 2025) prioritises iron and steel, aluminium, textiles/apparel, tyres, furniture and mattresses plus horizontal measures and carried-over energy-related products. **As of the latest sources (October 2026), no ESPR delegated act containing passport requirements had been adopted for any product group**; iron and steel, originally 2026, is now indicated for Q4 2026 at best, and passport duties apply no earlier than 18 months after an act enters into force, so the earliest realistic ESPR product passport duty is mid-2028.

### Cited Findings
- The Commission adopted the ESPR and Energy Labelling Working Plan 2025-2030 on 16 April 2025. — [Commission ESPR page](https://environment.ec.europa.eu/strategy/circular-economy/ecodesign-sustainable-products-regulation_en); [CLASP](https://cprc-clasp.ngo/updates/european-commission-adopts-ecodesign-sustainable-products-regulation-working-plan-2025-2030)
- Indicative adoption dates in the plan: final products — textiles/apparel (2027), tyres (2027), furniture (2028), mattresses (2029); intermediates — iron and steel (2026), aluminium (2027). — [Sidley](https://www.sidley.com/en/insights/newsupdates/2025/04/european-commission-releases-list-of-priority-products)
- Delegated acts are to be adopted progressively 2026-2030 with a minimum 18-month transition before application. — [One Click LCA](https://oneclicklca.com/en-gb/resources/articles/first-espr-working-plan)
- Some third-party trackers give different dates (furniture and mattresses as 2027-2028; tyres in a 2029-2030 window). These conflict with the Sidley summary of the plan; the plan's own dates are the reference. — [dpp-tool tracker](https://dpp-tool.com/en/blog/espr-delegated-acts/)
- **Status at 9 October 2026: no ESPR delegated act with DPP requirements had been published, so no ESPR category is under a passport duty.** — [dppatlas October 2026 update](https://dppatlas.eu/insights/dpp-update-october-2026) (secondary only)
- Iron and steel: public consultation ran 20 May to 12 August 2026; the Commission indicates Q4 2026 for adoption; no draft text of the act had been published per the source. **[DRAFT/EXPECTED; slipping within 2026]** — [dppatlas October 2026 update](https://dppatlas.eu/insights/dpp-update-october-2026); [DPPA iron and steel page](https://dppa.no/espr-iron-steel-digital-product-passport/)
- A second tracker, dated 11 October 2026, likewise lists no product-group delegated act as adopted and iron/steel as indicative Q4 2026. — [wisepim](https://wisepim.com/guides/digital-product-passport) (secondary only)
- Textiles, aluminium and tyres are grouped in the Commission's indicative timeline for Q3-Q4 2027; one guide says the textile act could slip by quarters. **[DRAFT/EXPECTED]** — [renoon updates](https://www.renoon.com/blog/digital-product-passport-latest-updates-the-next-developments-to-watch); [passportcraft](https://passportcraft.com/insights/dpp-timeline-2026-2030-every-deadline) (secondary only)
- One article claims textile deadlines were postponed with first provisions "scheduled to come into force in 2029"; its internal dating ("end of 2026 instead of 2025") does not match the working plan and no official source confirms it. — [Waro](https://www.waro.io/en/blog/le-report-des-echeances-espr-que-signifie-cela-pour-les-marques-de-textile) (low reliability)
- Separate from passports: ESPR Art 25 bans destruction of unsold apparel and footwear by large enterprises from 19 July 2026 (medium-sized from 19 July 2030). **[APPLICABLE]** — [esprregistry textiles page, via search](https://esprregistry.pages.dev/espr-delegated-act-textiles); [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)

### Summary table (dates are adoption of the delegated act; application = +18 months minimum)

| Product group | Working plan date | Status Nov 2026 | Earliest plausible passport duty |
|---|---|---|---|
| Iron and steel | 2026 | Consultation closed 12 Aug 2026; adoption indicated Q4 2026; not confirmed adopted | mid-2028 |
| Aluminium | 2027 | Not adopted | 2029 |
| Textiles/apparel | 2027 | Not adopted; indicated Q3-Q4 2027, slippage risk | 2029 |
| Tyres | 2027 | Not adopted | 2029 |
| Furniture | 2028 | Not adopted | 2029-2030 |
| Mattresses | 2029 | Not adopted | 2030-2031 |
| Energy-related products (carried over from 2022-2024 ecodesign plan) | rolling to 2030 | No passport-bearing act found | unknown |

### Inferences
- The "DPP is coming in 2026/2027" narrative common in vendor marketing is wrong for ESPR goods. The only hard-law passport date before 2028 is the battery passport (18 February 2027).
- Iron and steel was the plan's first act (2026). If Q4 2026 is missed, every downstream date is likely to shift; the founder should plan on ESPR product passports being a 2028-2030 revenue driver, not 2027.
- None of the prioritised groups is a "highly regulated good" in the pharma/food/cannabis sense; ESPR targets high-volume, high-footprint goods.

### Gaps
- Could not confirm from a primary source whether the iron and steel delegated act was adopted between 9 October and 13 November 2026. No report of adoption was found. **[UNCONFIRMED]**
- Could not retrieve the working plan text (COM(2025) 187) to confirm the horizontal measures (repairability; recyclability/recycled content of electrical and electronic equipment), the energy-related product list, or the footwear and chemicals studies. Researcher recollection is that the plan includes horizontal repairability requirements (around 2027) and EEE recyclability (around 2029), with footwear and chemicals deferred to studies, but this is unsourced here.

---

## 3. Explicit exclusions from ESPR and what they mean for cannabis

### Takeaway
ESPR Art 1(2) excludes food, feed, human and veterinary medicinal products, living plants/animals/micro-organisms, products of human origin, plant and animal products relating directly to their future reproduction, and (partly) vehicles. Medical cannabis, CBD food products, live cannabis plants and seeds therefore sit outside ESPR and cannot receive an ESPR passport duty; no source found any DPP initiative addressing cannabis.

### Cited Findings
- Article 1(2) of Regulation (EU) 2024/1781 (text as adopted; wording to be checked against EUR-Lex): "This Regulation does not apply to: (a) food as defined in Article 2 of Regulation (EC) No 178/2002; (b) feed as defined in Article 3, point (4), of Regulation (EC) No 178/2002; (c) medicinal products as defined in Article 1, point (2), of Directive 2001/83/EC; (d) veterinary medicinal products as defined in Article 4, point (1), of Regulation (EU) 2019/6; (e) living plants, animals and micro-organisms; (f) products of human origin; (g) products of plants and animals relating directly to their future reproduction; (h) vehicles as referred to in Article 2(1) of Regulation (EU) No 167/2013, in Article 2(1) of Regulation (EU) No 168/2013 and in Article 2(1) of Regulation (EU) 2018/858, in respect of those product aspects for which requirements are set out in sector-specific Union legislative acts applicable to those vehicles." — [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Search confirmation of the list and the cross-references (178/2002, 2001/83/EC, 2019/6; vehicle type-approval regulations "in respect of those product aspects for which requirements are set under sector-specific Union acts"). — [EUR-Lex consolidated PDF](https://eur-lex.europa.eu/eli/reg/2024/1781/2024-06-28/eng/pdf); [GS1 support note on out-of-scope products](https://support.gs1.org/support/solutions/articles/43000758757-which-products-are-out-of-scope-for-the-dpp-initiative-)
- Some third-party sites mis-cite the exclusions as "Article 2(3)"; the official location is Article 1(2). — [esprregistry scope page](https://esprregistry.pages.dev/espr-scope-products)
- Most ESPR requirements, including passports, are product-specific and arrive only through secondary legislation with their own deadlines. — [Cooley, 7 May 2026](https://products.cooley.com/2026/05/07/bitesize-ecodesign-for-sustainable-products-regulation/)
- A targeted search found no source discussing cannabis, hemp or CBD in relation to ESPR or the DPP, and no delegated act or working-plan entry covering them. — (negative search result, 13 Nov 2026)

### Inferences (researcher's legal reasoning; not sourced from commentary)
- **Medical cannabis** (finished medicines and, in most Member States, pharmacy-dispensed flower/extracts treated as medicinal products under Directive 2001/83/EC): excluded by Art 1(2)(c). Traceability there is governed by pharma law (GMP/GDP, narcotics law, Falsified Medicines Directive serialisation for prescription medicines), not ESPR.
- **CBD/hemp ingestibles** (oils, edibles, supplements, hemp-seed food): "food" under Regulation 178/2002, hence excluded by Art 1(2)(a); governed by food law and the Novel Food Regulation.
- **Live plants, clones, seeds**: excluded by Art 1(2)(e) and (g).
- **Recreational/adult-use cannabis flower**: Regulation 178/2002 Art 2 carves narcotic and psychotropic substances (and tobacco) out of the definition of "food", so the food exclusion does not obviously apply, and it is not a medicinal product. Formally it is a physical good not excluded by Art 1(2), i.e. theoretically within ESPR's potential scope, but (i) there is no EU-harmonised legal market, (ii) it is not in the working plan, and (iii) a delegated act is politically implausible. Practically: no EU passport duty in the foreseeable future; any track-and-trace duty will come from national cannabis laws (e.g. Germany, Malta, Netherlands experiment, Czechia, Switzerland pilots).
- **Hemp non-food products** (hemp textiles, hemp construction materials such as insulation/hempcrete, CBD cosmetics, vape hardware/batteries): within ESPR's general scope or other passport laws. Hemp textiles would fall under the textiles delegated act; hemp construction products under the CPR; vape batteries under the Batteries Regulation general rules (the battery passport itself only covers EV, LMT and industrial batteries above 2 kWh). Cosmetics are not excluded from ESPR but are not prioritised in the 2025-2030 plan.
- Net positioning point: for the regulated core of cannabis (medical, ingestible), the EU DPP is **not a legal driver**. A "Know Your Product" offering for those goods is voluntary or driven by sector law, and can borrow the DPP's technical stack (GS1 Digital Link, EN 182xx standards) for credibility and future interoperability rather than for compliance.

### Gaps
- No authoritative commentary found on the classification of adult-use cannabis under ESPR; the inference above is untested.
- Borderline products (CBD cosmetics, smokable hemp, vapes) depend on national classification, which was outside the scope searched.

---

## 4. Other EU laws creating passports or DPP-like duties

### Takeaway
Passport duties are spreading through sector laws faster than through ESPR itself. The only fixed near-term date is the battery passport on 18 February 2027; toys (2030), detergents (2029) and vehicles (2032) have dates in law; construction products depend on delegated acts not yet adopted.

### Cited Findings

| Law | Instrument | Status (Nov 2026) | Passport date | Source |
|---|---|---|---|---|
| Batteries Regulation (EU) 2023/1542, Art 77 | Battery passport for EV, light-means-of-transport and industrial batteries above 2 kWh | **[ADOPTED, NOT YET APPLICABLE]**; date unchanged | 18 February 2027 | [Environment+Energy Leader](https://environmentenergyleader.com/stories/battery-passport-becomes-mandatory-february-18-2027,142747); [CMS](https://cms.law/en/gbr/legal-updates/eu-sustainable-batteries-regulation-where-are-we-now) |
| Construction Products Regulation (EU) 2024/3110 | DPP per product family via delegated acts | In force 7 Jan 2025; applies from 8 Jan 2026; **passport system act not adopted**, indicative Q2 2027 (another source: Q4 2027) | Not set | [cobuilder](https://cobuilder.com/en/digital-product-passport-dpp/digital-product-passports-for-construction-what-the-eus-2026-2029-cpr-working-plan-means-for-stakeholders/); [myDPP](https://mydpp.app/en/knowledge/construction-products-regulation-cpr-and-dpp) |
| Toy Safety Regulation (EU) 2025/2509 | DPP for every toy (replaces EU declaration of conformity) | Published 12 Dec 2025; **[ADOPTED, NOT YET APPLICABLE]** | 1 August 2030 | [arianee guide](https://www.arianee.com/en/blog/digital-product-passports-guide); [traceable.digital tracker](https://traceable.digital/regulatory/espr-delegated-acts-tracker/) |
| Detergents Regulation (EU) 2026/405 | Passport per detergent/surfactant model before placing on market | **[ADOPTED, NOT YET APPLICABLE]** (secondary sources only for number/date) | 23 September 2029 | [greencalculus](https://greencalculus.com/standards/eu-digital-product-passport/) |
| End-of-Life Vehicles Regulation (EU) 2026/1738 | Digital Circularity Vehicle Passport (Art 13) | Published OJ 24 July 2026; in force 13 Aug 2026; general application 1 Sept 2028 | 1 September 2032 | [CDX](https://public.cdxsystem.com/en/web/cdx/w/eu-formally-adopts-end-of-life-vehicles-regulation-what-it-means-for-the-automotive-supply-chain); [Rematec](https://www.rematec.com/news/industry-players-and-markets/regulation-1738) |
| Packaging and Packaging Waste Regulation (EU) 2025/40, Art 12 | Not a passport; labelling plus QR/open digital data carrier; "single data carrier" rule where a product also has a DPP | In force 11 Feb 2025; applies from 12 Aug 2026; reusable-packaging label + data carrier from 12 Feb 2029 (or 30 months after implementing act). One source says 12 Aug 2028 for a general data carrier — unverified | 2028-2029 | [EUR-Lex PPWR](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202500040); [digiproductpass](https://www.digiproductpass.com/blog/ppwr-article-12-one-data-carrier-product-packaging) |

- The Commission's registry launch communication names batteries, construction products, toys, detergents and surfactants as the laws whose passports will register in the ESPR registry, noting their application dates "have not yet passed". — [Commission Retail transition pathway news](https://transition-pathways.europa.eu/retail/news/digital-product-passport-registry-now-live)
- Battery due-diligence obligations were postponed to 18 August 2027 under "Omnibus IV", but this did not move the passport date; Art 77 applies from 18 February 2027 regardless. — [tracextech](https://tracextech.com/?p=28747); [automobilista.it](https://www.automobilista.it/regolamento-batterie-ue-perche-la-due-diligence-slitta-al-2027-e-con-quali-effetti/)
- EUROBAT is lobbying (July 2026 amendments to the Environmental Omnibus) to keep the February 2027 start but phase in some data fields from 2030. This is a proposal, not law. — [EUROBAT amendments, 6 July 2026](https://eurobat.org/wp-content/uploads/2026/08/EUROBATs-Proposed-Amendments-to-the-Environmental-Omnibus-06.07.2026.pdf); [EUROBAT position paper](https://eurobat.org/wp-content/uploads/2025/09/EUROBAT-battery-passport-omnibus-position-paper-.pdf)
- The Commission published Digital Batteries Passport guidance on 21 August 2026. — [bdemerson](https://www.bdemerson.com/article/eu-battery-regulation) (secondary only)
- Some websites state DPPs "already apply" to construction products since January 2026; more detailed sources say the duty arrives family by family after the delegated act. Treat the former as wrong. — [myDPP](https://mydpp.app/en/knowledge/construction-products-regulation-cpr-and-dpp)

### Inferences
- The battery passport is the first real-world test of the whole stack (registry, access rights, service providers) and the first enforcement precedent. Vendors with battery references will carry that credibility into later sectors.
- Sector laws reuse the ESPR infrastructure (registry, standards, service-provider rules), so one technical stack serves all of them; the differences lie in the data content and the access rules.

### Gaps
- **Critical Raw Materials Act (EU) 2024/1252:** no search result on its DPP-linked duties. Researcher recollection is that it imposes data-carrier/labelling duties for products containing permanent magnets and refers to product passports where they exist, but dates and article numbers are unverified here.
- Detergents regulation number and date rest on vendor trackers only; one tracker also shows an inconsistent number for the toys act. Check the OJ.
- Not checked: the proposed Regulation on circularity for textiles/EPR, medical devices (EUDAMED/UDI is a separate, pre-existing identification system), tobacco track-and-trace (TPD Arts 15-16), pharma serialisation (FMD). These are DPP-like precedents in highly regulated sectors and are more relevant analogues for cannabis than ESPR, but were outside the searches run.

---

## 5. Status of the horizontal DPP-system acts and of simplification proposals

### Takeaway
The registry is live and governed by Implementing Regulation (EU) 2026/1778 (in force 6 August 2026). The delegated act on DPP service providers and their certification — the act that matters most for a provenance vendor — **has not been adopted**; its mid-2026 target slipped and sources now cite Q4 2026 to 2027. The omnibus simplification packages have not reduced or delayed ESPR passport obligations.

### Cited Findings
- **Registry [IN FORCE/LIVE]:** Commission Implementing Regulation (EU) 2026/1778 adopted 16 July 2026, published 17 July 2026, in force 6 August 2026. It implements ESPR Art 13 and covers registration requirements, management and transfer of registered passports, access rights for authorities, economic operators and customs, and data processing. — [fn.legal](https://fn.legal/en/implementing-regulation-on-the-product-passport-register/); [cleolabs](https://www.cleolabs.co/en/blog/eu-product-passport-registry-2026)
- The Commission launched the registry together with a testing environment on 20 July 2026 (ESPR deadline: 19 July 2026). — [Commission news, 20 July 2026](https://single-market-economy.ec.europa.eu/news/digital-product-passport-registry-now-live-2026-07-20_en); [LexisNexis news 21/07/2026](https://www.lexisnexis.co.uk/legal/news/commission-launches-digital-product-passport-registry-under-ecodesign-regulation)
- Registration is possible through a secure web interface or an API. — [Commission Retail transition pathway news](https://transition-pathways.europa.eu/retail/news/digital-product-passport-registry-now-live)
- "The launch of the Registry is not, by itself, a new registration obligation"; it is infrastructure for the phased rollout. Early use of the testing environment is encouraged. — [CMS](https://cms.law/en/int/legal-updates/key-development-in-the-eu-digital-product-passport-launch-of-the-dpp-registry)
- Registration triggers automated checks of structure and completeness, which are not a compliance determination. — [dpplive](https://dpplive.com/eu-dpp-registry-rules-2026-1778) (secondary only)
- One blog reports that only eIDAS-verified economic operators can register and that registration data is retained 10 years; another mentions a 90-day validity of proof of registration. Single-source details. — [myproductpassport.eu](https://myproductpassport.eu/blog/new-eu-regulation-digital-product-passport-20261778) (secondary only)
- The draft registry act went through "Have Your Say" feedback around April 2026. — [WKO copy of the draft](https://content.wko.at/ooe/Branchen/Industrie/Zusendungen/20260430%20HyS%20-%20DPP%20Registry.pdf)
- **DPP service providers [DELAYED / NOT ADOPTED]:** call for evidence on a certification scheme issued 9 April 2025; public consultation closed 1 July 2025; impact-assessment support study by Capgemini and Ecorys. — [dpp-tool regulatory register](https://dpp-tool.com/en/blog/espr-dpp-regulatory-register-official-texts/); [Orgalim response, 1 July 2025](https://orgalim.eu/wp-content/uploads/Orgalim_Consultation-on-DPP-service-providers.pdf); [AIOTI response](https://aioti.eu/wp-content/uploads/AIOTI-Response-Survey-on-the-Delegated-Act-on-potential-requirements-for-DPP-service-providers-250725-Submitted.pdf)
- A Commission (DG GROW) presentation stated adoption was planned for mid-2026; a Commission briefing at the WTO on 1 June 2026 placed the service-provider act in Q4 2026; vendor trackers now say Q3 2027 or "2027". — [Bundesnetzagentur-hosted Commission slides](https://www.bundesnetzagentur.de/DE/Fachthemen/Telekommunikation/Technik/DMUEF/DL_Vortraege/zibold.pdf?__blob=publicationFile&v=6); [WTO event slides, 1 June 2026](https://www.wto.org/library/events/event_resources/envir_0106202610/1126_3569.pdf); [renoon updates](https://www.renoon.com/blog/digital-product-passport-latest-updates-the-next-developments-to-watch)
- The certification model is not published: unclear whether it will be full ex-ante third-party certification, lighter conformity assessment, voluntary certification or a hybrid. Orgalim argued for self-assessment as the rule with third-party assessment allowed. — [infodpp](https://infodpp.eu/en/knowledge-base/dpp-service-provider-requirements-explained/); [Orgalim](https://orgalim.eu/wp-content/uploads/Orgalim_Consultation-on-DPP-service-providers.pdf)
- A developer notes the registry's reference to "verified" service providers has no verification rules behind it yet because the service-provider act is missing. One developer's reading, not official. — [GitHub issue](https://github.com/odal-node/dpp-core/issues/260)
- **Simplification/omnibus:** the sustainability omnibus (CSRD/CSDDD) entered into force 18 March 2026 and does not affect ESPR passport obligations; ESPR "has not undergone a single substantive amendment". — [passportcraft](https://passportcraft.com/insights/eu-omnibus-dpp-obligations-unchanged); [The Traceability Hub](https://thetraceabilityhub.com/expert-qa/with-the-omnibus-package-has-europe-delayed-everything-does-that-include-the-digital-product-passport/) (secondary only)
- In the environmental omnibus proposal of December 2025 the Commission proposed removing the SCIP hazardous-substances database, arguing DPPs reduce its added value; two further amendment proposals (electronic format of documents; a September 2026 one on public procurement) do not postpone or reduce DPP requirements. — [passper.eu](https://www.passper.eu/dpp-omnibus-proposal.html) (secondary only)

### Inferences
- The simplification agenda has so far treated the DPP as the *replacement* for other reporting burdens (SCIP, paper declarations of conformity) rather than as a target for cuts. Political risk to the DPP is delay of delegated acts, not repeal.
- Until the service-provider act is adopted, nobody can be a "certified DPP service provider"; any vendor claiming certification today is ahead of the law. With the battery passport applying in February 2027 and needing backup copies, there is a real gap between obligation and certification regime.
- If the final scheme requires ex-ante third-party certification, it becomes a barrier to entry that favours established providers; if self-assessment, the market stays open. This is the single most important pending decision for a new entrant.

### Gaps
- Not found: any separately adopted act on data carriers or on access rights. Researcher understanding is that these are handled through the harmonised standards and the product-specific delegated acts rather than through stand-alone horizontal acts, but this is unconfirmed.
- Not confirmed from a primary source: whether a draft of the service-provider delegated act was published for feedback in 2026. The dppatlas October update cites a "Have Your Say" entry for the planned act, without detail.
- Status of the environmental omnibus in Parliament/Council as of November 2026 not established.

---

## 6. Harmonised standards from CEN/CENELEC JTC 24

### Takeaway
The eight-standard DPP series exists: six were published on 27 May 2026 and (per CEN-CENELEC) cited in the Official Journal; EN 18246 appears published in September 2026; the status of EN 18239 (access rights/security) is the one item sources disagree on.

### Cited Findings

| Number | Subject | Status | Source |
|---|---|---|---|
| EN 18219:2026 | Unique identifiers | Published 27 May 2026 | [CDX](https://public.cdxsystem.com/en/web/cdx/w/first-european-standards-for-the-digital-product-passport-published); [genorma](https://genorma.com/en/standards/en-18219-2026) |
| EN 18220:2026 | Data carriers | Published 27 May 2026 | [CDX](https://public.cdxsystem.com/en/web/cdx/w/first-european-standards-for-the-digital-product-passport-published) |
| EN 18216:2026 | Data exchange protocols | Published 27 May 2026 | [genorma](https://genorma.com/en/standards/en-18216-2026/amp) |
| EN 18221:2026 | Data storage, archiving and persistence | Published 27 May 2026 | [genorma](https://genorma.com/en/standards/en-18221-2026) |
| EN 18222:2026 | APIs for lifecycle management and searchability | Published 27 May 2026 | [CDX](https://public.cdxsystem.com/en/web/cdx/w/eu-digital-product-passport-what-the-new-technical-standards-mean-for-your-business) |
| EN 18223:2026 | System interoperability | Published 27 May 2026 | [genorma](https://genorma.com/en/standards/en-18223-2026-1) |
| EN 18246:2026 (was FprEN 18246) | Data authentication, reliability, integrity (tamper-evidence) | Listed as published 16 Sept 2026 | [genorma](https://genorma.com/en/standards/en-18246-2026) |
| FprEN / EN 18239 | Access rights management, IT security, business confidentiality | Expected Sept-Oct 2026; publication **[UNCONFIRMED]** | [CDX](https://public.cdxsystem.com/en/web/cdx/w/first-european-standards-for-the-digital-product-passport-published); [passportcraft](https://passportcraft.com/insights/dpp-timeline-2026-2030-every-deadline) |

- CEN-CENELEC's 15 July 2026 news item describes "the first series of 8 European standards" and says six of the eight had already been cited in the Official Journal. — [CEN-CENELEC, 15 July 2026](https://www.cencenelec.eu/news-events/news/2026/en-in-the-spotlight/2026-07-15-dpp/)
- One vendor source states all eight are published; another says six in May 2026 with two more expected by October 2026. — [renoon updates](https://www.renoon.com/blog/digital-product-passport-latest-updates-the-next-developments-to-watch); [passportcraft](https://passportcraft.com/insights/dpp-timeline-2026-2030-every-deadline)
- Standards are obtained through national standardisation bodies; an early report noted they were not immediately available for purchase. — [Think WIoT](https://wiot-group.com/think/en/news/cen-cenelec-six-eu-dpp-standards-en-18xxx/)
- GS1 positions its standards (GTIN, GS1 Digital Link, 2D codes) as ESPR-compliant identifiers and carriers. — [GS1 in Europe, "GS1 Standards Enabling DPP" v2.2](https://gs1.eu/wp-content/uploads/2025/04/GS1-Standards-Enabling-DPP-V2.2.pdf)

### Inferences
- With six standards OJ-cited, the technical baseline for identifiers, carriers, storage, APIs and interoperability is now stable enough to build against. The two late standards (integrity/authentication and access rights/security) are exactly the ones most relevant to a provenance and verification business; EN 18246 should be obtained and read.
- EN 18246 standardises tamper-evidence and authentication of DPP data, not the truth of the underlying claim. Evidence that a claim is true (lab results, chain of custody, audits) remains outside the harmonised stack.

### Gaps
- The standardisation request reference (the brief's "M/604") could not be verified; the request is generally cited as a Commission implementing decision of July 2024 addressed to CEN/CENELEC, but no source retrieved here confirms the number.
- cencenelec.eu could not be fetched, so OJ citation references (implementing decision number/date) and the final status of EN 18239 are unconfirmed.
- CIRPASS-2 deliverables were not retrieved.

---

## 7. Enforcement: penalties, market surveillance, customs, responsible operators

### Takeaway
ESPR sets no EU-level fine amounts: Art 74 obliges Member States to lay down effective, proportionate and dissuasive penalties. Enforcement runs through national market surveillance authorities plus an automated customs gate keyed to the registry; duties cascade from manufacturer to importer, distributor, dealer, online marketplace and fulfilment provider. Figures such as "5% of turnover" circulating on vendor sites are not in the regulation.

### Cited Findings
- Art 74: penalties are set nationally and must be effective, proportionate and dissuasive, taking account of gravity, intent and economic benefit. — [esprregistry penalties page](https://esprregistry.pages.dev/espr-penalties-enforcement); [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Art 74 also requires that penalties include at least fines and time-limited exclusion from public procurement (from the regulation text). — [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Vendor sites quote inconsistent numbers (up to 5% of global turnover for DPP failures and 3% for design breaches; "Germany up to EUR 50,000 per SKU"; EUR 25,000-100,000). None could be verified against the regulation or national law; one such source also mis-numbers the regulation. Treat as unreliable. — [dpp-tool penalties](https://dpp-tool.com/en/blog/espr-penalties/); [sorena penalties guide](https://sorena-io.pages.dev/artifacts/eu/ecodesign-for-sustainable-products-regulation/penalties-and-fines)
- Authorities can order product modification, withdrawal from the market and recall, and can access passport data by scanning the carrier. — [esprregistry penalties page](https://esprregistry.pages.dev/espr-penalties-enforcement)
- Any economic operator placing a physical product on the EU market is in scope, including importers and distributors; distributors must ensure storage and handling do not jeopardise compliance and must cooperate with authorities. — [A&O Shearman](https://www.aoshearman.com/en/insights/navigating-the-eus-ecodesign-for-sustainable-products-regulation)
- Role-specific duties in Chapter VII of ESPR (from the regulation text; article numbers to be checked): manufacturers must ensure a passport exists and is accurate and a backup copy is held by a service provider (Art 27); authorised representatives (Art 28); importers must verify before placing on the market that the manufacturer has made the passport available and that the carrier is present (Art 29); distributors must verify the carrier/passport before making available (Art 30); dealers must make the passport easily accessible to customers including in distance selling (Art 31); fulfilment service providers must not jeopardise compliance (Art 33); importers/distributors who rebrand or modify take on manufacturer duties (Art 34); online marketplaces must cooperate with authorities, design interfaces so sellers can display required information, and act on notices, alongside Digital Services Act duties (Art 35); supply-chain actors must provide information on request (Art 38). — [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781); table of contents confirming Art 38 "Requirements on supply chain actors": [lexaris](https://lexaris.de/library/tableofcontents/5200351)
- For non-EU manufacturers, the importer (identified by EORI in the passport) or an authorised representative is the EU-based responsible operator; Annex III requires the passport to name the EU-established economic operator. — [EUR-Lex ELI](https://eur-lex.europa.eu/eli/reg/2024/1781)
- Customs: release for free circulation is conditional on a valid unique registration identifier, checked automatically against the registry. — [sorena requirements guide](https://sorena-io.pages.dev/artifacts/eu/digital-product-passport/requirements)

### Inferences
- The customs gate makes the DPP a market-access condition rather than a paperwork duty that can be remedied after the fact. That is the strongest enforcement lever and the reason non-EU exporters must comply.
- Importers and distributors have verification duties but no means to check content accuracy themselves; this creates demand for third-party assurance of supplier-provided passport data.
- No ESPR passport enforcement has happened yet anywhere, because no product is under an ESPR passport duty. First enforcement experience will come from batteries after February 2027.

### Gaps
- National penalty regimes implementing Art 74 (e.g. Germany, France, Netherlands) were not found; no verified fine amounts.
- No specific commentary retrieved on online marketplace or dealer duties; the entries above rely on the regulation text as recalled.

---

## 8. Non-EU reactions (Switzerland in particular; UK, China, US)

### Takeaway
No major non-EU jurisdiction has enacted a horizontal DPP law. Switzerland has no national DPP rule and is following de facto via its exporters and GS1 Switzerland; the UK opened a call for evidence on a "digital product record" in July 2026; China and the US are pursuing sector-specific traceability, mainly batteries.

### Cited Findings
- **Switzerland:** the DPP is not introduced in Swiss law but is "unavoidable" for companies serving the EU market. — [Helbling](https://helbling.ch/en/insights/how-companies-can-prepare-for-the-digital-product-passport-dpp-now)
- A 2026 legal review notes that given Switzerland's partial alignment with EU product law in this field, further developments are likely. — [Chambers Product Liability and Safety 2026](https://gpg-pdf.chambers.com/Product-Liability-and-Safety-2026/276/)
- GS1 Switzerland is working with Swiss manufacturers on GS1 Digital Link, on the stated basis that the state does not want to prescribe the technical design in detail; it held a DPP conference on 8 October 2026 in Zurich. — [Handelsverband Swiss](https://handelsverband.swiss/fr/events/gs1-swiss-dpp-conference-2026-get-fit-for-future/)
- The federal construction-procurement coordination body KBOB published a DPP position paper dated 1 July 2025. — [KBOB Grundlagenpapier DPP](https://www.kbob.admin.ch/dam/de/sd-web/XtU2aKG2mRws/20250701_Grundlagenpapier%20DPP_DES.pdf)
- Swiss advisory firms (KPMG, PwC, EY) and the export promotion agency S-GE are publishing DPP readiness guidance for Swiss exporters; KPMG notes the registry went live July 2026 and that timing differs by category and may continue to shift. — [KPMG Switzerland](https://kpmg.com/ch/en/insights/esg-sustainability/digital-product-passport.html); [S-GE](https://www.s-ge.com/export/en/article/news/2026-e-france-ct10-eu-digital-product-passport); [PwC Switzerland](https://www.pwc.ch/en/insights/sustainability/passport-to-sustainability.html)
- **UK:** on 27 July 2026 the Department for Business and Trade opened a call for evidence on a "digital product record" (DPR) policy, asking whether the UK should build its own framework. Textiles are not in the initial priority list. — [CMS](https://cms.law/en/gbr/legal-updates/digital-product-records-uk-call-for-evidence-and-eu-dpp-update); [The Lawyer briefing](https://www.thelawyer.com/briefing/digital-product-passports-dpp-a-new-tool-in-the-brand-protection-toolkit/)
- **China:** no horizontal DPP regulation; rapid sector-specific traceability, especially batteries; CAICT published a 2025 research report on DPP technology; model described as state-operated platforms. — [Compliance & Risks](https://www.complianceandrisks.com/blog/digital-product-passports-beyond-europe-which-countries-are-moving-and-how-do-they-compare-with-the-eu/); [renoon](https://www.renoon.com/blog/which-other-countries-are-implementing-digital-product-passports-from-china-and-uns-global-push-digital-product-passports-go-global)
- **US:** no federal mandate; sector-specific and voluntary initiatives and state-level experimentation; US exporters must comply for EU-bound goods. — [Compliance & Risks](https://www.complianceandrisks.com/blog/digital-product-passports-beyond-europe-which-countries-are-moving-and-how-do-they-compare-with-the-eu/); [Tilkal](https://www.tilkal.com/post/digital-product-passports-beyond-europe-how-global-markets-are-converging-toward-product-data-requi)
- Japan is active on battery passport ecosystems; Australia and Malaysia are in policy discussion. — [dpp-tool country guide](https://dpp-tool.com/en/guide/dpp-country-guide/) (secondary only)
- The Commission presented the DPP at the WTO on 1 June 2026. — [WTO event slides](https://www.wto.org/library/events/event_resources/envir_0106202610/1126_3569.pdf)

### Inferences
- Switzerland's pattern is autonomous adaptation: no own DPP statute, but industry builds to EU specifications through GS1. A Swiss-based provenance company faces no domestic DPP mandate and must sell on EU market access or voluntary value.
- The UK's "digital product record" signals a parallel but not identical regime; divergence risk for vendors is in data schema, not core technology.

### Gaps
- No Swiss federal decision adopting ESPR or setting a Swiss DPP timeline was found. Whether DPP rules will fall under the EU-Switzerland Mutual Recognition Agreement or the Bilaterals III package was not established.
- No primary Chinese or US government source was retrieved.
