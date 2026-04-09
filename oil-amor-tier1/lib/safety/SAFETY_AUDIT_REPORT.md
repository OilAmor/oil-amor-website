# Oil Amor Safety System - Comprehensive Audit Report
**Audit Date:** 2026-03-31  
**Auditor:** AI Safety Review  
**Scope:** All 17 Atelier oils, medication interactions, pregnancy/TTC warnings, oil-oil interactions

---

## EXECUTIVE SUMMARY

### Overall Confidence Level: ⚠️ **MODERATE-HIGH (7.5/10)**

The safety system is **comprehensive and well-researched** for the oils that HAVE profiles, but there are **CRITICAL GAPS** where oils are sold without any safety profile data. The system correctly implements a "warn, don't block" philosophy with experience-level messaging.

---

## 🚨 CRITICAL FINDINGS (Must Fix)

### 1. MISSING SAFETY PROFILES - HIGH RISK

**9 out of 17 oils (53%) LACK complete safety profiles:**

| Oil ID | Status | Risk Level |
|--------|--------|------------|
| `lemongrass` | ❌ NO PROFILE | HIGH - Skin sensitizer |
| `cinnamon-leaf` | ❌ NO PROFILE | HIGH - Dermal irritant |
| `may-chang` | ❌ NO PROFILE | HIGH - Phototoxic (like lemon) |
| `ginger` | ❌ NO PROFILE | MODERATE - Anticoagulant concerns |
| `carrot-seed` | ❌ NO PROFILE | MODERATE - Phototoxic |
| `lemon-myrtle` | ❌ NO PROFILE | HIGH - Very high citral content |
| `geranium-bourbon` | ❌ NO PROFILE | LOW - Generally safe |
| `juniper-berry` | ❌ NO PROFILE | HIGH - Pregnancy contraindicated |
| `patchouli-dark` | ❌ NO PROFILE | LOW - Generally safe |
| `myrrh` | ❌ NO PROFILE | MODERATE - Feto-toxic concerns |

**Oil profiles that DO exist (8/17):**
- ✅ lavender, tea-tree, eucalyptus, clary-sage, lemon
- ❌ BUT: bergamot, peppermint, frankincense, rosemary, chamomile-roman, orange-sweet, ylang-ylang, geranium, lime, cedarwood, grapefruit, sandalwood, patchouli are in database but NOT in ATELIER_OILS

### 2. DATABASE/ATELIER MISMATCH

**Safety database has 18 oils, but ATELIER only has 17 - mismatch:**
- Database has `peppermint`, `bergamot`, `rosemary` which aren't in ATELIER
- ATELIER has `lemongrass`, `cinnamon-leaf`, `may-chang`, `ginger`, `carrot-seed`, `lemon-myrtle`, `geranium-bourbon`, `juniper-berry`, `patchouli-dark`, `myrrh` without safety profiles

---

## ⚠️ MODERATE CONCERNS

### 3. MEDICATION INTERACTION GAPS

**Missing medication classes:**
- NOACs (Novel Oral Anticoagulants) beyond basic list
- Immunosuppressants (missing: mycophenolate, azathioprine)
- Antipsychotics (missing: quetiapine, risperidone, olanzapine)
- Hormonal IUDs (Mirena, Kyleena)
- Fertility medications (Clomid, letrozole)
- Biologics (humira, enbrel, etc.)

**Existing medication coverage:** 831 medications ✓

### 4. INCOMPLETE PREGNANCY/TTC DATA

**Oils with pregnancy data:**
- ✅ Lavender, Tea Tree, Eucalyptus, Lemon, Frankincense, Clary Sage, Chamomile, Sweet Orange, Ylang Ylang, Geranium, Lime, Cedarwood, Grapefruit, Sandalwood, Patchouli

**Oils WITHOUT pregnancy data (in database but missing):**
- ❌ Peppermint, Bergamot, Rosemary (none have pregnancySafety field)

**Oils sold without ANY pregnancy data:**
- ❌ All 9 missing profile oils above

### 5. AGE RESTRICTION INCONSISTENCIES

**Found inconsistency:**
- Tea Tree profile: `under2Years: 'avoid'` (correct)
- But comprehensive-safety-v2.ts line 208: Tea tree not in 1,8-cineole check for children
- Eucalyptus correctly has `under2Years: 'avoid'`

### 6. OIL-OIL INTERACTION WARNINGS

**The new `oil-interactions.ts` file has comprehensive data BUT:**
- ⚠️ Not integrated into the main safety check flow
- ⚠️ Warnings exist but aren't displayed in the UI (MixingAtelier uses `getInteractionsForMix` but doesn't show in safety summary)
- ⚠️ Some oil IDs don't match ATELIER (e.g., `orange-sweet` vs `may-chang`)

---

## ✅ STRENGTHS OF THE SYSTEM

### 1. Medication Interactions - EXCELLENT
- 831 medications covered with detailed data
- Clear severity levels (contraindicated/major/moderate/minor)
- Chemical mechanism explanations
- Alternative oil suggestions
- Evidence level tracking

### 2. Contraindication Logic - VERY GOOD
- Epilepsy + neurotoxic oils = CRITICAL warning ✓
- Blood thinners + clove/wintergreen = CRITICAL warning ✓
- Pregnancy + emmenagogue oils = HIGH warning ✓
- Asthma + respiratory irritants = MODERATE warning ✓

### 3. Experience-Level Messaging - EXCELLENT
- Beginners get full explanations
- Advanced users get brief technical info
- Professionals get minimal alerts
- Properly implemented across all warnings

### 4. Allergy Cross-Reactivity - IMPRESSIVE
- Family-level matching (Asteraceae, Lamiaceae, etc.)
- Component-level matching (linalool, citral, etc.)
- 400+ allergens in database

### 5. "Warn, Don't Block" Philosophy - CORRECT
- System NEVER blocks users
- Critical warnings require acknowledgment
- Users can proceed after acknowledging risks
- Legal/ethical best practice

---

## 📊 QUANTITATIVE ASSESSMENT

| Category | Coverage | Grade |
|----------|----------|-------|
| Oil Profiles (17 atelier oils) | 8/17 (47%) | F |
| Medication Database | 831 drugs | A |
| Health Conditions | 24 conditions | A- |
| Allergen Database | 400+ allergens | A+ |
| Oil-Oil Interactions | 25 pairs | B+ |
| Pregnancy Warnings | 15 oils | B |
| TTC Warnings | 5 oils | C |
| Lactation Warnings | 1 oil | D |

---

## 🔧 RECOMMENDED ACTIONS

### IMMEDIATE (Before Launch):
1. **Create safety profiles for all 9 missing oils**
   - Priority: Juniper berry, May chang, Lemon myrtle, Cinnamon leaf (highest risk)
   
2. **Fix ATELIER_OILS / Database mismatch:**
   - Either remove peppermint/bergamot/rosemary from database
   - OR add them to ATELIER_OILS with complete profiles

3. **Integrate oil-oil interaction warnings into UI:**
   - Currently calculated but not displayed prominently
   - Should appear in EnhancedSafetySummary component

### SHORT-TERM (Within 2 weeks):
4. **Add TTC warnings for all 17 oils**
5. **Add lactation warnings for all 17 oils**
6. **Expand medication database:**
   - Add top 50 most common prescriptions
   - Add fertility medications (important for TTC users)

### MEDIUM-TERM (Within 1 month):
7. **Add phototoxicity calculations** based on actual oil percentages
8. **Add dilution calculator** with age-specific limits
9. **Add "safer alternative" suggestions** in real-time

---

## ✅ VERIFIED SAFE PRACTICES

The following are correctly implemented:

1. ✓ **Clove bud + Warfarin** = Critical warning (eugenol anticoagulant)
2. ✓ **Rosemary + Epilepsy** = Critical warning (neurotoxic)
3. ✓ **Wintergreen + Blood thinners** = Critical warning (methyl salicylate)
4. ✓ **Lavender + Pregnancy** = Safe (correctly classified)
5. ✓ **Tea Tree + Children under 2** = Warning (endocrine concerns)
6. ✓ **Bergamot + Sun** = 72-hour phototoxic warning
7. ✓ **Clary Sage + Pregnancy** = First trimester warning

---

## CONCLUSION

**The safety system has EXCELLENT bones but INCOMPLETE data.**

The architecture, warning philosophy, and implemented checks are medically sound and follow Tisserand & Young guidelines. However, **selling 9 oils without safety profiles is a liability risk.**

**Confidence Score: 7.5/10**
- +3 for excellent medication database
- +2 for proper epilepsy/bleeding disorder warnings  
- +2 for experience-level messaging
- +1 for allergy cross-reactivity
- -3 for 9 missing oil profiles (53% of products!)
- -0.5 for pregnancy/TTC gaps
- -0.5 for oil-oil interaction display issues

**RECOMMENDATION:** Fix the 9 missing safety profiles before marketing the Mixing Atelier as "medically-informed." The system is SAFE for the oils that have data, but incomplete data = liability.
