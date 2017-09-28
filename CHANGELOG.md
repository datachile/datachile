# Datachile CHANGELOG

## 2017.09.28 release
* Web app
  * General 
    * Responsive breakpoints mixins definition.
    * Generic Nav component: Contains title, section, links and language selector.
    * Nav Side Menu: render menu options on small screens + list of topics when exists (profiles).
    * Canon & D3plus version updated.
    * Other generic components for profile: topics menu, slider, slider control, slides.
  * Geo Profile
    * Splash implemented: 
      * Ministats (population,income,psu)
      * Authorities (president,senators,mayor)
      * Map navigation (region,comuna)
    * Economy charts implemented:
      * Industry
      * Employment
      * Income
    * Education charts implemented:
      * Enrollment: school type when drilling down at Country or Region Level, individual schools at Comuna level.
    * Demography charts:
      * Origins (migration)
  * Product profile
    * Responsive Splash implemented: 
      * Ministats (top destination country,total exports,top producer region)
  * Other profiles (Industry, Institution, Countries, Careers)
    * Responsive Splash implemented with placeholders.

* Design
  * Profile content validation.
  * Charts legend icon set.
  * Profiles splash assets.

* Data
  * Query creation (@pachamaltese)
  * New dimensions and measure added (age ranges, iso3 codes, deciles calculation)
  * New level on educational institutions.
  * Update ISIC revision to match tax data for NENE survey.
