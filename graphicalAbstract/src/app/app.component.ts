import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Component, OnInit } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import * as FileSaver from 'file-saver';
import { Table } from 'primeng/table';
import { ServiceService } from './service.service';
import { switchMap } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
interface DATA {
  size: number;
  attributes: any[]
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  panelSize: any = [10000, 0];
  enableGraph: boolean = false;
  enableRealtions: boolean = false;
  enableEntities: boolean = false;
  // file: File | null = null;
  // selectedFileError: boolean = false;
  value: string = "";
  queryText: string = "";
  // disablePMCIDInput: boolean = false;
  data: any;
  dataString: string[] = [];
  root!: am5.Root;
  entityData: any = [];
  relationData: any = [];
  first = 0;
  rows = 100;
  entityColumns: string[] = ["Text", "Category", "Type", "Score"];
  relationColumns: string[] = ["Realtion ID", "ENTITY 1", "TYPE 1", "RELATION", "ENTITY 2", "TYPE 2", "Realtion Text"];
  home: boolean = true;
  aboutUS: boolean = false;
  enableForm: boolean = true;
  pmid: any[] | undefined;
  selectedPmid: any = { pmid: "" };
  renderTextData: any = {};
  progressSpinner: boolean = true;
  progressSpinner1: boolean = true;
  progressSpinner2: boolean = true;
  progressSpinner3: boolean = true;
  url: SafeResourceUrl  = '';
  constructor(private service: ServiceService,private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    // window.open('http://localhost:5000/graph_data/', '_blank');
  }

  returnHome() {
    this.home = true;
    this.aboutUS = false;
  }

  returnAboutUS() {
    this.home = false;
    this.aboutUS = true;
  }

  // onFileSelected(event: any): void {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     const fileType = selectedFile.type;
  //     if (fileType === 'application/pdf' || fileType === 'text/xml') {
  //       this.file = selectedFile;
  //       this.selectedFileError = false;
  //       this.disablePMCIDInput = true;
  //     } else {
  //       event.target.value = null;
  //       this.selectedFileError = true;
  //       this.disablePMCIDInput = false;
  //     }
  //   }
  // }

  onSubmit() {
    this.panelSize = [30, 70];
    this.enableGraph = true;
    this.enableForm = false;
    // this.service.getSerachData(this.value).subscribe((data)=>{
    //   this.pmid=data.data;
    //   this.selectedPmid=this.pmid[0]
    //   this.textRender(this.selectedPmid.pmid);
    //   this.service.getRelations().subscribe((resp)=>{
    //     console.log(resp.data.data);
    //   })
    //   this.service.getEntites().subscribe((entity)=>{
    //     this.entityData=entity.data.data;
    //   })
    // })
    this.service.getSerachData(this.value).pipe(
      switchMap((data) => {
        this.pmid = data.data;
        this.selectedPmid = this.pmid[0];
        this.textRender(this.selectedPmid.pmid);
        this.progressSpinner1 = false;
        return this.service.getRelations();
      }),
      switchMap((resp) => {
        // console.log(resp.data.data);
        // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost:5000/graph_data/");
        this.progressSpinner = false;
        this.relationData = resp.data.data.relations;
        this.progressSpinner2 = false;
        return this.service.getEntites();
      })
    ).subscribe((entity) => {
      this.entityData = entity.data.data;
      this.progressSpinner3 = false;
      // this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost:5000/graph_data/");
    });
    // this.pmid=[
    //     {
    //       "pmid": "38394712",
    //       "title": "Effects of psychotherapy interventions on anxiety and depression in patients with gastrointestinal cancer: A systematic review and network meta-analysis.",
    //       "summary": "Various psychological interventions have been demonstrated to be effective at preventing anxiety and depression symptoms in patients with gastrointestinal (GI) cancer. However, it remains unclear which intervention is the best option. This study aimed to evaluate the impact of various psychological interventions on anxiety and depression in symptomatic patients with GI cancer.The PubMed, Cochrane Library, Embase, CNKI, WanFang Data, and VIP databases were systematically searched from inception to June 2023 to identify randomized controlled trials (RCTs). The primary outcomes were anxiety and depression levels. Two reviewers independently selected the studies, extracted the data based on prespecified criteria, and evaluated the risk of bias using the Cochrane Collaboration risk of bias tool. Stata 14.0 was used to conduct network meta-analysis.Thirty-two RCTs (2453 patients) involving 9 psychological interventions were included. The results of the network meta-analysis showed that cognitive-behavioral therapy (CBT; mean difference [MD]\u00a0=\u00a0-4.98, 95% CI (-7.04, -2.93), relaxation therapy (MD\u00a0=\u00a0-4.39, 95% CI (-7.90, -0.88), reminiscence therapy (MD\u00a0=\u00a0-5.01, 95% CI (-8.20, -1.81)), and narrative nursing (MD\u00a0=\u00a0-4.89, 95% CI (-8.54, -1.23)) significantly reduced anxiety levels, and CBT (MD\u00a0=\u00a0-2.15, 95% CI (-4.28, -0.02), reminiscence therapy (MD\u00a0=\u00a0-7.20, 95% CI (-10.48, -3.91), and narrative nursing (MD\u00a0=\u00a0-7.20, 95% CI (-10.48, -3.91)) significantly reduced depression levels in patients with GI cancer compared with conventional nursing care.The findings of this network meta-analysis revealed that CBT, reminiscence therapy and narrative nursing can be actively considered as part of sequential therapy to reduce anxiety and depression levels in patients with GI cancer.Copyright \u00a9 2024 The Authors. Published by Elsevier Inc. All rights reserved."
    //     },
    //     {
    //       "pmid": "38394701",
    //       "title": "Dual-responsive 3D DNA nanomachines cascaded hybridization chain reactions for novel self-powered flexible microRNA-detecting platform.",
    //       "summary": "The microRNA-21 is closely related to chromatin remodeling and epigenetic regulation. In this work, an efficient double-response 3D DNA nanomachine (DRDN) was assembled by co-immobilizing two different lengths of hairpin DNA on the surface of gold nanoparticles (AuNPs) to capture microRNA-21 (miRNA-21), recycle miRNA-21, and trigger hybridization chain reactions (HCR). This work reports the fabrication of a laser-scribed graphene (LSG) electrode with excellent flexibility and electrical conductivity by laser-scribing commercial polyimide films (PI). The as-proposed self-powered biosensing platform presents significantly increased instantaneous current to in real-time monitor miRNA-21 by a capacitor. The biosensing platform exhibited highly sensitive detection of miRNA-21 with a detection limit of 0.142\u00a0fM in the range of 0.5\u00a0fM to 1\u00a0\u00d7\u00a0104\u00a0fM, and demonstrated high efficiency in the analysis of the tumor markers.Copyright \u00a9 2024 Elsevier B.V. All rights reserved."
    //     },
    //     {
    //       "pmid": "38394685",
    //       "title": "Structural Basis for Multivalent MUC16 Recognition and Robust Anti-Pancreatic Cancer Activity of Humanized Antibody AR9.6.",
    //       "summary": "Mucin-16 (MUC16) is a target for antibody-mediated immunotherapy in pancreatic ductal adenocarcinoma (PDAC) amongst other malignancies. The MUC16 specific monoclonal antibody AR9.6 has shown promise for PDAC immunotherapy and imaging. Here, we report the structural and biological characterization of the humanized AR9.6 antibody (huAR9.6). The structure of huAR9.6 was determined in complex with a MUC16 SEA (Sea urchin sperm, Enterokinase, Agrin) domain. Binding of huAR9.6 to recombinant, shed, and cell-surface MUC16 was characterized, and anti-PDAC activity was evaluated in vitro and in vivo. huAR9.6 bound a discontinuous, SEA domain epitope with an affinity of ~90 nM. Binding affinity depended on the specific SEA domain(s) present, and glycosylation enhanced affinity by 3-7-fold driven by favorable entropy and enthalpy and via distinct transition state thermodynamic pathways. Treatment with huAR9.6 reduced the in vitro growth, migration, invasion, and clonogenicity of MUC16-positive PDAC cells and patient-derived organoids (PDOs). HuAR9.6 blocked MUC16-mediated ErbB and AKT activation in PDAC cells, PDOs and patient-derived xenografts and induced antibody-dependent cellular cytotoxicity and complement-dependent cytotoxicity. More importantly, huAR9.6 treatment caused substantial PDAC regression in subcutaneous and orthotopic tumor models. The mechanism of action of huAR9.6 may depend on dense avid binding to homologous SEA domains on MUC16. The results of this study validate the translational therapeutic potential of huAR9.6 against MUC16-positive PDACs."
    //     },
    //     {
    //       "pmid": "38394671",
    //       "title": "Trunk Muscle Function and Core Stability in Women Who Had Muscle-Sparing Pedicled Transverse Rectus Abdominis Myocutaneous Flap Breast Reconstruction.",
    //       "summary": "The long-term effects of the unilateral muscle-sparing pedicled transverse rectus abdominis myocutaneous (TRAMmsp) flap procedure on trunk muscle performances and core stability were investigated in women with breast cancer.Forty women (mean age\u2009=\u200942.6\u00a0years) who had received breast reconstruction with the unilateral TRAMmsp flap procedure no less than 6\u00a0months earlier (mean\u2009=\u200910.3 [SD\u2009=\u20094.9] months) (TRAM group) participated, and 30 women who were healthy and matched for age (mean age\u2009=\u200941.2\u00a0years) served as controls (control group). Their abdominal and back muscle strength was assessed using the curl-up and prone extension tests, respectively, and their static abdominal muscle endurance and back extensor endurance were assessed using the sit-up endurance test in the crook-lying position and the Biering-S\u00f8rensen test, respectively. Core stability strength was assessed using a 4-level limb-lowering test (abdominal muscle test) and core stability endurance was assessed while lying supine with both flexed legs 1 inch off the mat while keeping the pelvis in a neutral position with a pressure biofeedback unit.Compared with the control group, trunk muscles of the TRAM group were weaker, showing less endurance, as were their core stability strength and endurance. Static trunk muscle endurances and trunk flexion strength were associated with core stability in both groups.Women exhibit trunk flexor and extensor weakness along with poor endurance and impaired core stability even after an average of 10\u00a0months from receiving the TRAMmsp flap procedure. Immobilization after surgery, with possible systemic inflammatory effects from surgery and chemotherapy, might have further contributed to the generalized weakness subsequent to the partial harvesting of the rectus abdominis.Women after breast reconstruction with the TRAMmsp flap procedure show long-lasting deficits of strength and endurance in abdominal muscles, back extensors, and core stability. Proactive measures including early detection and evaluation of impairments as well as timely intervention targeting these clients are important to minimize the dysfunction and support their return to community participation.\u00a9 The Author(s) 2024. Published by Oxford University Press on behalf of the American Physical Therapy Association. All rights reserved. For permissions, please e-mail: journals.permissions@oup.com."
    //     },
    //     {
    //       "pmid": "38394668",
    //       "title": "CD38-directed, single-chain T cell-engager targets leukemia stem cells through IFN\u03b3-induced CD38 expression.",
    //       "summary": "Treatment resistance of leukemia stem cells (LSCs) and suppression of the autologous immune system represent major challenges to achieve a cure in acute myeloid leukemia (AML). Although AML blasts generally retain high levels of surface CD38 (CD38pos), LSCs are frequently enriched in the CD34posCD38neg blast fraction. Here, we report that IFN\u03b3 reduces LSCs clonogenic activity and induces CD38 upregulation in both CD38pos and CD38neg LSC-enriched blasts. IFN\u03b3-induced CD38 upregulation depends on IRF-1 transcriptional activation of the CD38 promoter. To leverage this observation, we created a novel compact, single-chain CD38-CD3 T cell engager (BN-CD38) designed to promote an effective immunological synapse between both CD8 and CD4 T cells and CD38pos AML cells. We demonstrate that BN-CD38 engages autologous CD4pos and CD8pos T cells and CD38pos AML blasts leading to T cell activation and expansion and to the elimination of leukemia cells in an autologous setting. Importantly, BN-CD38 engagement induces the release of high levels of IFN\u03b3, driving the expression of CD38 on CD34posCD38neg LSC-enriched blasts and their subsequent elimination. Critically, while BN-CD38 showed significant in vivo efficacy across multiple disseminated AML cell lines and patient derived xenograft models, it did not affect normal hematopoietic stem cell clonogenicity and the development of multi-lineage human immune cells in CD34pos humanized mice. Taken together, this study provides important insights to target and eliminate AML LSCs.Copyright \u00a9 2024 American Society of Hematology."
    //     },
    //     {
    //       "pmid": "38394666",
    //       "title": "Daratumumab Carfilzomib Lenalidomide and Dexamethasone with tandem transplant in high-risk newly diagnosed myeloma.",
    //       "summary": "High-risk (HR) cytogenetics are associated with poor outcomes in newly diagnosed multiple myeloma (NDMM) and dedicated studies should address this difficult-to-treat population. The phase 2 study 2018-04 from the Intergroupe Francophone du Myelome evaluated feasibility of an intensive strategy with quadruplet induction and consolidation plus tandem transplant in HR transplant eligible (TE) NDMM (NCT03606577). HR cytogenetics were defined by the presence of del(17p), t(4;14) and/or t(14;16). Treatment consisted in daratumumab-carfilzomib-lenalidomide-dexamethasone (D-KRd) induction (6 cycles), autologous stem cell transplantation (ASCT), D-KRd consolidation (4 cycles), second ASCT, and daratumumab-lenalidomide maintenance for 2 years. The primary endpoint was feasibility. Fifty patients with previously untreated NDMM were included. Median age was 57. Del(17p), t(4;14) and t(14;16) were found in 40%, 52% and 20% of patients respectively. At data cut-off, the study met the primary endpoint with 36 (72%) patients completing second transplant. Twenty patients (40%) discontinued the study due to stem-cell collection failure (n=8), disease progression (n=7), adverse event (n=4), consent withdrawal (n=1). Grade 3-4 Dara-KRd induction/consolidation related adverse events (>5% of patients) were neutropenia (39%), anemia (12%), thrombocytopenia (7%) and infection (6%). The overall response rate was 100% for patients completing second transplant (n=36), including 81% complete response. Pre-maintenance Minimal Residual Disease (MRD) negativity rate (NGS, 10-6) was 94%. After a median follow up of 33 months, the 30-month progression-free (PFS) and overall survival were 80% and 91%, respectively. In conclusion, D-KRd with tandem transplant is feasible in high-risk TE NDMM patients and resulted in high rates of MRD negativity and PFS.Copyright \u00a9 2024 American Society of Hematology."
    //     },
    //     {
    //       "pmid": "38394658",
    //       "title": "Both ends of the scalpel: a child's journey from \"Nemo fin\" to neurosurgeon.",
    //       "summary": ""
    //     },
    //     {
    //       "pmid": "38394646",
    //       "title": "Assessment of Advanced Diagnostic Bronchoscopy Outcomes for Peripheral Lung Lesions: A Delphi Consensus Definition of Diagnostic Yield and Recommendations for Patient-centered Study Designs.",
    //       "summary": "Advanced diagnostic bronchoscopy targeting the lung periphery has developed at an accelerated pace over the last two decades, while evidence to support introduction of innovative technologies has been variable and deficient. A major gap relates to variable reporting of diagnostic yield, in addition to limited comparative studies.To develop a research framework to standardize the evaluation of advanced diagnostic bronchoscopy techniques for peripheral lung lesions. Specifically, we aimed for consensus on a robust definition of diagnostic yield, and propose potential study designs at various stages of technology development.Panel members were selected for their diverse expertise. Workgroup meetings were conducted in virtual or hybrid format. The co-chairs subsequently developed summary statements, with voting proceeding according to a modified Delphi process. The statement was co-sponsored by the American Thoracic Society and the American College of Chest Physicians.Consensus was reached on 15 statements on definition of diagnostic outcomes and study designs. A strict definition of diagnostic yield should be used, and studies should be reported according to the STARD (Standards for Reporting Diagnostic Accuracy studies) guidelines. Clinical or radiographic follow-up may be incorporated into the reference standard definition but should not be used to calculate diagnostic yield from the procedural encounter. Methodologically robust comparative studies, with incorporation of patient-reported outcomes, are needed to adequately assess and validate minimally invasive diagnostic technologies targeting the lung periphery.This ATS/CHEST statement aims to provide a research framework that allows for greater standardization of device validations efforts, through clearly defined diagnostic outcomes and robust study designs. High-quality studies, both industry and publicly funded, can support subsequent health economic analyses, and guide implementation decisions in various healthcare settings."
    //     },
    //     {
    //       "pmid": "38394643",
    //       "title": "Multi-omics Analyses Identify AKR1A1 as a Biomarker for Diabetic Kidney Disease.",
    //       "summary": "Diabetic kidney disease (DKD) is the leading cause of end-stage kidney disease. As many genes associate with DKD, multi-omics approaches were employed to narrow the list of functional genes, gene products and related pathways providing insights into the pathophysiological mechanisms of DKD. The Kidney Precision Medicine Project human kidney single-cell RNA-sequencing (scRNAseq) dataset and Mendeley Data on human kidney cortex biopsy proteomics were utilized. R package Seurat was used to analyze scRNAseq and subset proximal tubule cells. PathfindR was applied for pathway analysis in cell type-specific differentially expressed genes and R limma package was used to analyze differential protein expression in kidney cortex. A total of 790 differentially expressed genes were identified in proximal tubule cells, including 530 upregulated and 260 downregulated transcripts. Compared with differentially expressed proteins, 24 genes/proteins were in common. An integrated analysis combining protein quantitative trait loci (pQTL), GWAS hits (estimated glomerular filtration rate) and a plasma metabolomics analysis was performed using baseline metabolites predictive of DKD progression in our longitudinal Diabetes Heart Study samples. Aldo-keto reductase family 1 member A1 gene (AKR1A1) was revealed as a potential molecular hub for DKD cellular dysfunction in several cross-linked pathways featured by deficiency of this enzyme.\u00a9 2024 by the American Diabetes Association."
    //     },
    //     {
    //       "pmid": "38394627",
    //       "title": "Magnetic resonance guided adaptive post prostatectomy radiotherapy: Accumulated dose comparison of different workflows.",
    //       "summary": "The aim of this study was to assess the use of magnetic resonance guided adaptive radiotherapy (MRgART) in the post-prostatectomy setting; comparing dose accumulation for our initial seven patients treated with fully adaptive workflow on the Unity MR-Linac (MRL) and with non-adaptive plans generated offline. Additionally, we analyzed toxicity in patients receiving treatment.Seven patients were treated with MRgART. The prescription was 70-72\u00a0Gy in 35-36 fractions. Patients were treated with an adapt to shape (ATS) technique. For each clinically delivered plan, a non-adaptive plan based upon the reference plan was generated and compared to the associated clinically delivered plan. A total of 468 plans were analyzed. Concordance Index of target and Organs at Risk (OARs) for each fraction with reference contours was analyzed. Acute toxicity was then assessed at six-months following completion of treatment with Common Terminology for Adverse Events (CTCAE) Toxicity Criteria.A total of 246 fractions were clinically delivered to seven patients; 234 fractions were delivered via MRgART and 12 fractions delivered via a traditional linear accelerator due to machine issues. Pre-treatment reference plans met CTV and OAR criteria. PTV coverage satisfaction was higher in the clinically delivered adaptive plans than non-adaptive comparison plans; 42.93% versus 7.27% respectively. Six-month CTCAE genitourinary and gastrointestinal toxicity was absent in most patients, and mild-to-moderate in a minority of patients (Grade 1 GU toxicity in one patient and Grade 2 GI toxicity in one patient).Daily MRgART treatment consistently met planning criteria. Target volume variability in prostate bed treatment can be mitigated by using MRgART and deliver satisfactory coverage of CTV whilst minimizing dose to adjacent OARs and reducing toxicity.\u00a9 2024 The Authors. Journal of Applied Clinical Medical Physics published by Wiley Periodicals LLC on behalf of American Association of Physicists in Medicine."
    //     },
    //     {
    //       "pmid": "38394624",
    //       "title": "Exosomes: A Cutting-Edge Theranostics Tool for Oral Cancer.",
    //       "summary": "Exosomes are a subpopulation of extracellular vesicles (EVs) secreted by cells. In cancer, they are key cellular messengers during cancer development and progression. Tumor-derived exosomes (TEXs) promote cancer progression. In oral cancer, the major complication is oral squamous cell carcinoma (OSCC). Exosomes show strong participation in several OSCC-related activities such as uncontrolled cell growth, immune suppression, angiogenesis, metastasis, and drug and therapeutic resistance. It is also a potential biomarker source for oral cancer. Some therapeutic exosome sources such as stem cells, plants (it is more effective compared to others), and engineered exosomes reduce oral cancer development. This therapeutic approach is effective because of its specificity, biocompatibility, and cell-free therapy (it reduced side effects in cancer treatment). This article highlights exosome-based theranostics signatures in oral cancer, clinical trials, challenges of exosome-based oral cancer research, and future improvements. In the future, exosomes may become an effective and affordable solution for oral cancer."
    //     },
    //     {
    //       "pmid": "38394619",
    //       "title": "Erratum: Pathologic Exploration of the Axillary Soft Tissue Microenvironment and Its Impact on Axillary Management and Breast Cancer Outcomes.",
    //       "summary": ""
    //     },
    //     {
    //       "pmid": "38394611",
    //       "title": "International collaboration between low-middle-income and high-income institutions to improve radiation therapy care delivery.",
    //       "summary": "The Philippines is a lower-middle-income island country with over 153 000 new cancer diagnosis each year. Despite many patients needing radiotherapy as part of disease management, there remains limitations to access. Currently, the Philippines has 50 linear accelerator facilities serving a population of 110 million. However, given the recommendation of 1 linear accelerator for every 250 thousand people, it is evident that the demand for accessible radiotherapy resources is significantly underserved in the country. This paper outlines the collaboration between GenesisCare Solutions (GCS) and Fairview Cancer Center (FCC) to address efficiency and access within the radiotherapy department at FCC.Through international collaboration between GCS and FCC, areas for improvement were identified and categorized into four domains: Dosimetry quality, Patient workflow, Data & Reporting, and Information Technology (IT) Infrastructure. Action plans were developed then implemented. A baseline measurement was obtained for each domain, and post-implementation evaluation undertaken at 3 months, 6 months, and 12 months. Data captured within the electronic medical record system was extrapolated, and average treatment times were established for pre- and post-engagement. A paired, 2-tailed t-test was used for statistical analysis of outcome parameters using IBM SPSS version 23 for all statistics.Twelve months post-initial engagement, all four domains saw positive outcomes. Improved plan quality linked to Intensity Modulated Radiotherapy (IMRT) utilization rates saw an increase from 20% to 54%. A significant reduction in patient average wait times was also observed, from 27 to 17 min (p\u00a0\u2264\u00a00.001). Prior to engagement, tracking patient demographics and diagnosis was not prioritized, post engagement an average of 92% diagnosis entry compliance was achieved.Through the collaboration of GCS and FCC, objectives in all action plan domains were achieved, highlighting the benefits of collaboration between low-middle-income and high-income institutions.\u00a9 2024 The Authors. Journal of Applied Clinical Medical Physics published by Wiley Periodicals, LLC on behalf of The American Association of Physicists in Medicine."
    //     },
    //     {
    //       "pmid": "38394553",
    //       "title": "Decommissioning of a Medical Cyclotron Vault: the Case Study of the National Cancer Institute of Milano.",
    //       "summary": "In the widespread use of medical cyclotrons for isotope production, radiological and economic consequences related to the decommissioning of particle accelerators are often neglected. However, decommissioning regulation and its related procedures always demand efforts and costs that can unexpectedly impact on budgets. The magnitude of this impact depends strongly on the residual radioactivity of the accelerator and of the vault, and more specifically on the kind and activity concentration of residual radionuclides. This work reports and discusses a case study that analyzes in detail the characterization activities needed for optimized management of the decommissioning of a medical cyclotron vault. In particular, this paper presents the activities carried out for assessing the activity concentrations and for guiding the disposal of the cyclotron vault of the Italian National Cancer Institute of Milano (INT). An unshielded 17 MeV cyclotron vault was characterized by high resolution gamma-ray spectrometry both in-situ and in-laboratory on extracted samples. Monte Carlo simulations were also carried out to assess the overall distribution of activation in the vault. After a few months from the final shutdown of the accelerator, activity concentrations in the concrete walls due to neutron activation exceeded the clearance levels in many regions, especially close to the cyclotron target. Due to the relatively long half-lives of some radionuclides, a time interval of about 20 y after the end of bombardment is necessary for achieving clearance in some critical positions. Far from the target or in positions shielded by the cyclotron, activation levels were below the clearance level. The comparison between Monte Carlo simulations and experimental results shows a good agreement. The in-situ measurements, simpler and economically advantageous, cannot completely replace the destructive measurements, but they may limit the number of required samples and consequently the decommissioning costs. The methodology described and the results obtained demonstrated that it is possible to obtain accurate estimations of activity concentrations with cheap and quick in-situ measurements if the concentration profile in-depth inside the wall is well known. This profile can be obtained either experimentally or numerically through suitably validated Monte Carlo simulations.Copyright \u00a9 2024 Health Physics Society."
    //     },
    //     {
    //       "pmid": "38394549",
    //       "title": "Cause of death among gastric cancer survivors in the United States from 2000 to 2020.",
    //       "summary": "A number of studies have been conducted to explore the survival of gastric cancer (GC) patients, while studies about non-cancer causes of death in patients with GC are not well-conducted. The aim of this study was to deeply investigate the causes of death (COD) in GC patients, especially non-cancer ones. The Surveillance, Epidemiology and End Results (SEER) database was used to extract information including demographics, tumor characteristics and causes of death of GC patients meeting the inclusion criteria. The patients were stratified by demographic and clinical parameters. Standardized mortality ratios (SMRs) were calculated for all causes of death at different follow-up periods. A total of 116,437 patients with GC diagnosed between 2000 and 2020 were retrieved from the SEER database. Of these, 85,827 deaths occurred during the follow-up period, most of which occurred within 1 year after GC diagnosis. GC (n\u2005=\u200549,746; 58%) was the leading COD, followed by other cancer (n\u2005=\u200521,135; 25%) and non-cancer causes (n\u2005=\u200514,946; 17%). Diseases of heart were the most common non-cancer cause of death, accounting for 30%, followed by cerebrovascular diseases (n\u2005=\u2005917; 6%) and chronic obstructive pulmonary disease (n\u2005=\u2005900; 6%). Although gastric cancer remains the most common cause of death in gastric cancer patients, it should not be ignored that the risk of non-cancer causes tends to increase with the length of the latency period. These findings may provide important insights into the healthcare management of gastric cancer patients at various follow-up intervals.Copyright \u00a9 2024 the Author(s). Published by Wolters Kluwer Health, Inc."
    //     },
    //     {
    //       "pmid": "38394546",
    //       "title": "Chemotherapy-associated hemorrhagic posterior reversible encephalopathy syndrome (PRES) with considerations for circle of Willis variants on cerebral blood flow and autoregulation: A case report.",
    //       "summary": "Hodgkin lymphoma, a lymphatic system cancer, is treated by chemotherapy, radiation therapy, and hematopoietic stem cell transplantation. Posterior reversible encephalopathy syndrome (PRES) is a rare neurotoxic effect associated with several drugs and systemic conditions. This case study emphasizes the potential risks of intensive chemotherapy regimens and postulates the impact of the circle of Willis variants on the heterogeneity of hemispheric lesions in PRES.A 42-year-old woman diagnosed with stage IIA nodular sclerosing Hodgkin lymphoma and chronic thrombocytopenia presented after 6 years of initial diagnosis and 4 years post-haploidentical transplant. She underwent planned chemotherapy with ifosfamide, carboplatin, and etoposide.She developed an alteration in her mental status. A computerized tomography scan and angiogram of the head and neck revealed findings consistent with PRES and a left fetal-type posterior cerebral artery with an aplastic A1 segment of the left anterior cerebral artery. One hour later she was found comatose with clinical sequelae of an uncal herniation.Subsequent events led to emergent intubation, and administration of 23.4% hypertonic saline. A repeat computerized tomography scan showed a right intraparenchymal hemorrhage with fluid-fluid levels measuring up to 4.7\u2009cm, bilateral subarachnoid hemorrhage, right uncal herniation, and 15\u2009mm of leftward midline shift. She emergently underwent a right decompressive hemi-craniectomy.An magnetic resonance imaging of the brain demonstrated bilateral cytotoxic edema involving the parieto-occipital lobes. Despite interventions, the patient's neurological condition deteriorated, leading to a declaration of brain death on the 8th day.This case underscores the importance of recognizing the severe neurological complications, including PRES, associated with chemotherapeutic treatments in Hodgkin lymphoma. PRES may also be exacerbated by coagulopathies such as thrombocytopenia in this case. The circle of Willis variants may influence cerebral blood flow, autoregulation, and other factors of hemodynamics, leading to increased susceptibility to both radiographic lesion burden and the worst clinical outcomes.Copyright \u00a9 2024 the Author(s). Published by Wolters Kluwer Health, Inc."
    //     },
    //     {
    //       "pmid": "38394545",
    //       "title": "A literature review of a meta-analysis of BRAF mutations in non-small cell lung cancer.",
    //       "summary": "The research on the relationship between the Braf Proto-oncogene (BRAF) mutation and lung cancer has generated conflicting findings. Nevertheless, there is an argument suggesting that assessing the BRAF status could offer benefits in terms of managing and prognosing individuals with non-small cell lung cancer (NSCLC). To present a comprehensive overview of this subject, we undertook an up-to-date meta-analysis of pertinent publications.We conducted an extensive literature search utilizing Medical Subject Headings keywords, namely \"BRAF\", \"mutation\", \"lung\", \"tumor\", \"NSCLC\", and \"neoplasm\", across multiple databases, including PubMed, EMBASE, ISI Science Citation Index, and CNKI. For each study, we calculated and evaluated the odds ratio and confidence interval, focusing on the consistency of the eligible research.The meta-analysis unveiled a noteworthy correlation between BRAF mutation and lung cancer. No significant evidence was found regarding the connection between smoking and staging among individuals with BRAF mutations. Furthermore, a substantial disparity in the rate of BRAF mutations was observed between males and females.Our meta-analysis revealed a significant correlation between BRAF mutations and NSCLC. Moreover, we observed a higher incidence of BRAF lung mutations in females compared to males. Additionally, the BRAFV600E mutation was found to be more prevalent among female patients and nonsmokers.Copyright \u00a9 2024 the Author(s). Published by Wolters Kluwer Health, Inc."
    //     },
    //     {
    //       "pmid": "38394536",
    //       "title": "The investigation of cytotoxic and apoptotic activity of Cl-amidine on the human U-87 MG glioma cell line.",
    //       "summary": "Peptidyl (protein) arginine deiminases (PADs) provide the transformation of peptidyl arginine to peptidyl citrulline in the presence of calcium with posttranslational modification. The dysregulated PAD activity plays an important role on too many diseases including also the cancer. In this study, it has been aimed to determine the potential cytotoxic and apoptotic activity of chlorine-amidine (Cl-amidine) which is a PAD inhibitor and whose effectiveness has been shown in vitro and in vivo studies recently on human glioblastoma cell line Uppsala 87 malignant glioma (U-87 MG) forming an in vitro model for the glioblastoma multiforme (GBM) which is the most aggressive and has the highest mortality among the brain tumors.In the study, the antiproliferative and apoptotic effects of Cl-amidine on GBM cancer model were investigated. The antiproliferative effects of Cl-amidine on U-87 MG cells were determined by 4-[3-(4-iodophenyl)-2-(4-nitrophenyl)-2H-5-tetrazolio]-1,3-benzene disulfonate method at the 24th and 48th hours. The apoptotic effects were analyzed by Annexin V and Propidium iodide staining, caspase-3 activation, and mitochondrial membrane polarization (5,5', 6,6'-tetrachloro-1,1', 3,3' tetraethyl benzimidazolyl carbocyanine iodide) methods in the flow cytometry.It has been determined that Cl-amidine exhibits notable antiproliferative properties on U-87 MG cell line in a time and concentration-dependent manner, as determined through the 4-[3-(4-iodophenyl)-2-(4-nitrophenyl)-2H-5-tetrazolio]-1,3-benzene disulfonate assay. Assessment of apoptotic effects via Annexin V and Propidium iodide staining and 5,5', 6,6'-tetrachloro-1,1', 3,3' tetraethyl benzimidazolyl carbocyanine iodide methods has revealed significant efficacy, particularly following a 24-hour exposure period. It has been observed that Cl-amidine induces apoptosis in cells by enhancing mitochondrial depolarization, independently of caspase-3 activation. Furthermore, regarding its impact on healthy cells, it has been demonstrated that Cl-amidine shows lower cytotoxic effects when compared to carmustine, an important therapeutic agent for glioblastoma.The findings of this study have shown that Cl-amidine exhibits significant potential as an anticancer agent in the treatment of GBM. This conclusion is based on its noteworthy antiproliferative and apoptotic effects observed in U-87 MG cells, as well as its reduced cytotoxicity toward healthy cells in comparison to existing treatments. We propose that the antineoplastic properties of Cl-amidine should be further investigated through a broader spectrum of cancer cell types. Moreover, we believe that investigating the synergistic interactions of Cl-amidine with single or combination therapies holds promise for the discovery of novel anticancer agents.Copyright \u00a9 2024 the Author(s). Published by Wolters Kluwer Health, Inc."
    //     },
    //     {
    //       "pmid": "38394531",
    //       "title": "Laparoscopic repair of perineal hernia and unilateral inguinal hernia after rectal cancer surgery: A case report.",
    //       "summary": "Perineal hernia (PH) is a rare complication that can occur after abdominoperineal resection for rectal cancer. Laparoscopic repair of PHs has gained increasing popularity compared to open approaches due to advantages such as superior visualization, decreased invasiveness, and faster recovery. This case report highlights the successful use of laparoscopic tension-free mesh repair for concurrent perineal and inguinal hernias after rectal cancer surgery.A 51-year-old man underwent laparoscopic-assisted abdominoperineal resection for rectal cancer. About 2 months postoperatively, he developed reducible masses in the perineal and left groin regions, associated with urinary symptoms and sensation of prolapse. Physical exam revealed protruding masses that enlarged with Valsalva. Pelvic CT confirmed PH and left inguinal hernia.Laparoscopic tension-free repair of the PH and inguinal hernia was performed on this patient. The repair was completed by the steps of adhesion separation, mesh placement, and fixation.The 98-minute surgery was successful without complications. The patient recovered well, ambulating on postoperative day 2 and getting discharged on day 6.This case demonstrates that laparoscopic tension-free repair with mesh is an effective approach for treating PH and concurrent inguinal hernia following rectal cancer surgery, resulting in successful outcomes and low recurrence rates. The laparoscopic technique provides benefits of minimal invasiveness and rapid recovery.Copyright \u00a9 2024 the Author(s). Published by Wolters Kluwer Health, Inc."
    //     },
    //     {
    //       "pmid": "38394528",
    //       "title": "Malignant melanoma located in the ureter and gallbladder: A case report and literature review.",
    //       "summary": "Melanoma is one of a common cutaneous malignancy. Currently, metastatic malignant melanoma is difficult to be diagnosed through imaging examinations. Furthermore, the incidence of metastatic melanoma affecting the gallbladder and ureter is exceptionally rare.A 54-year-old female was admitted to the hospital with a half-month history of left lower back pain. Correlative examination revealed an occupying lesion in the mid-left ureter and the neck of the gallbladder.The patient was initially diagnosed with gallbladder cancer and left ureteral carcinoma based on imaging. Following 2 operations, immunohistochemical staining confirmed the presence of metastatic melanoma involving both the gallbladder and ureter.After multidisciplinary consultation and obtaining consent from the patient and her family, the patient underwent left radical nephroureterectomy, radical cholecystectomy, laparoscopic partial hepatectomy (Hep IV, Hep V), and lymph node dissection of hepatoduodenal ligament.One month after treatment, the patient imaging showed no disease progression, and at 6 months of follow-up, the patient was still alive.It is difficult to distinguish metastatic melanoma from carcinoma in situ by imaging. In addition, metastatic malignant melanoma lacks specific clinical manifestations and is prone to misdiagnosis, which emphasizes the highly aggressive nature of malignant melanoma.Copyright \u00a9 2024 the Author(s). Published by Wolters Kluwer Health, Inc."
    //     }
    //   ]


    // this.entityData =
    //   [
    //     {
    //       "Id": "0",
    //       "BeginOffset": "1",
    //       "EndOffset": "0",
    //       "Score": "8",
    //       "Text": "0.912246",
    //       "Category": "Prostate",
    //       "Type": "ANATOMY",
    //       "Traits": "SYSTEM_ORGAN_SITE",
    //       "Attributes": "[]"
    //     },
    //     {
    //       "Id": "1",
    //       "BeginOffset": "2",
    //       "EndOffset": "0",
    //       "Score": "15",
    //       "Text": "0.566787",
    //       "Category": "Prostate cancer",
    //       "Type": "MEDICAL_CONDITION",
    //       "Traits": "DX_NAME",
    //       "Attributes": "[{'Name': 'DIAGNOSIS', 'Score': 0.970363199710…]"
    //     }
    //   ]
    //   this.pmid = [
    //     { pmid: 'New York'},
    //     { pmid: 'Rome'},
    //     { pmid: 'London'},
    //     { pmid: 'Istanbul'},
    //     { pmid: 'Paris'}
    // ];
    // this.data = this.data = {
    //   size: 0, attributes: [
    //     {
    //       id: 0,
    //       "link": [
    //         "Malignantneoplasmofprostate"
    //       ],
    //       "size": 2,
    //       "tableName": "LDLCholesterolLipoproteins"
    //     },
    //     {
    //       id: 1,
    //       "link": [
    //         "Malignantneoplasmofprostate"
    //       ],
    //       "size": 2,
    //       "tableName": "PharmaceuticalPreparations"
    //     },
    //     {
    //       id: 2,
    //       "link": [
    //         "Malignantneoplasmofprostate"
    //       ],
    //       "size": 2,
    //       "tableName": "NPC1L1"
    //     },
    //     {
    //       id: 3,
    //       "link": [
    //         "Malignantneoplasmofprostate",
    //         "Testosterone"
    //       ],
    //       "size": 3,
    //       "tableName": "PCSK9"
    //     },
    //     {
    //       id: 4,
    //       "link": [
    //         "LDLCholesterolLipoproteins",
    //         "PharmaceuticalPreparations",
    //         "NPC1L1",
    //         "PCSK9",
    //         "Testosterone"
    //       ],
    //       "size": 3,
    //       "tableName": "Malignantneoplasmofprostate"
    //     },
    //     {
    //       id: 5,
    //       "link": [
    //         "PCSK9",
    //         "Malignantneoplasmofprostate"
    //       ],
    //       "size": 3,
    //       "tableName": "Testosterone"
    //     }
    //   ]
    // }

    // for (let i = 0; i < this.data.attributes.length; i++) {
    //   if (this.data.attributes[i].link) {
    //     var metaString = "";
    //     for (let j = 0; j < this.data.attributes[i].link.length; j++) {
    //       if (i == this.data.attributes.length) {
    //         metaString = metaString + this.data.attributes[i].tableName + " -> " + this.data.attributes[i].link[j];
    //       } else {
    //         metaString = metaString + this.data.attributes[i].tableName + " -> " + this.data.attributes[i].link[j] + "\n";
    //       }
    //     }
    //     this.data.attributes[i].metaData = metaString;
    //     this.dataString.push(metaString);
    //   }
    // }
    // this.renderChart(this.data);
  }

  textRender(pmid: any) {
    for (let i = 0; i < this.pmid.length; i++) {
      if (this.pmid[i].pmid == pmid) {
        this.renderTextData = this.pmid[i];
        break;
      }
    }
  }

  // queryResult() {
  //   let data: DATA = { size: 0, attributes: [] }
  //   var query = this.queryText.split(",")
  //   for (let j = 0; j < query.length; j++) {
  //     for (let i = 0; i < this.dataString.length; i++) {
  //       console.log(this.dataString[i])
  //       if (this.dataString[i].includes(query[j]) == true) {
  //         const idExists = data.attributes.some(attr => attr.id === this.data.attributes[i].id);
  //         if (!idExists) {
  //           data.attributes.push(this.data.attributes[i]);
  //         }
  //         data.attributes.push(this.data.attributes[i]);
  //         console.log(this.dataString[i])
  //       }
  //     }
  //   }
  //   this.renderChart(data)
  // }

  // renderChart(data: any) {
  //   if (this.root) {
  //     this.root.dispose();
  //   }
  //   setTimeout(() => {
  //     this.loadChart(data);
  //   }, 1000);
  // }

  renderGraph() {
    this.enableRealtions = false;
    this.enableGraph = true;
    this.enableEntities = false;
    // this.renderChart(this.data);
  }

  renderRelations() {
    this.enableGraph = false;
    this.enableRealtions = true;
    this.enableEntities = false;
  }

  renderEntities() {
    this.enableGraph = false;
    this.enableRealtions = false;
    this.enableEntities = true;
  }

  // loadChart(data: any) {
  //   this.root = am5.Root.new("chartDiv");
  //   var rootInstance = this.root;
  //   // Set themes
  //   // https://www.amcharts.com/docs/v5/concepts/themes/
  //   this.root.setThemes([
  //     am5themes_Animated.new(this.root)
  //   ]);

  //   let tempData = data;

  //   let zoomableContainer = this.root.container.children.push(
  //     am5.ZoomableContainer.new(this.root, {
  //       width: am5.p100,
  //       height: am5.p100,
  //       wheelable: false,
  //       pinchZoom: false
  //     })
  //   );

  //   let zoomTools = zoomableContainer.children.push(am5.ZoomTools.new(this.root, {
  //     target: zoomableContainer
  //   }));

  //   // Create series
  //   // https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
  //   let series = zoomableContainer.contents.children.push(am5hierarchy.ForceDirected.new(this.root, {
  //     maskContent: false, //!important with zoomable containers
  //     singleBranchOnly: false,
  //     downDepth: 2,
  //     topDepth: 1,
  //     initialDepth: 3,
  //     valueField: "size",
  //     categoryField: "tableName",
  //     childDataField: "attributes",
  //     idField: "tableName",
  //     manyBodyStrength: -10,
  //     centerStrength: 0.8,
  //     linkWithField: "link",
  //     tooltip: am5.Tooltip.new(this.root, {
  //       labelText: "\n[bold]{tableName}[/]\n{metaData}"
  //     })
  //   }));
  //   // Hide circles
  //   series.circles.template.set("forceHidden", true);
  //   series.outerCircles.template.set("forceHidden", true);

  //   // Add an ellipsis to node
  //   series.nodes.template.setup = function (target: any) {
  //     target.events.once("dataitemchanged", function (ev: any) {
  //       var target = ev.target;
  //       target.dataItem.on("circle", function (circle: any) {
  //         circle.on("radius", function (radius: any, circle: any) {
  //           var ellipsis = circle.getPrivate("customData");
  //           if (ellipsis) {
  //             ellipsis.setAll({
  //               radiusX: circle.get("radius"),
  //               radiusY: circle.get("radius") * 0.6
  //             })
  //           }
  //           else {
  //             ellipsis = target.children.unshift(am5.Ellipse.new(rootInstance, {
  //               radiusX: circle.get("radius"),
  //               radiusY: circle.get("radius") * 0.6,
  //               centerX: am5.percent(50),
  //               centerY: am5.percent(50),
  //               fill: circle.get("fill")
  //             }));
  //             circle.setPrivate("customData", ellipsis);
  //           }
  //         })
  //       })
  //     });
  //   }

  //   series.links.template.set("strength", 1);
  //   series.links.template.setAll({
  //     strokeWidth: 3,
  //     strokeOpacity: 0.5
  //   });

  //   series.links.template.states.create("active", {
  //     strokeWidth: 3,
  //     strokeOpacity: 1
  //   });

  //   series.nodes.template.events.on("pointerover", function(ev:any) {
  //     am5.array.each(ev.target.dataItem.get("links"), function(link:any) {
  //       link.set("active", true);
  //     });
  //   });

  //   series.nodes.template.events.on("pointerout", function(ev:any) {
  //     am5.array.each(ev.target.dataItem.get("links"), function(link:any) {
  //       link.set("active", false);
  //     });
  //   });
  //   series.labels.template.set("minScale", 0);

  //   series.data.setAll([tempData]);

  //   var container = this.root.container.children.push(
  //     am5.Container.new(this.root, {
  //       width: am5.percent(90),
  //       height: am5.percent(100),
  //       layout: this.root.gridLayout,
  //     })
  //   );

  //   var legend = container.children.push(
  //     am5.Legend.new(this.root, {
  //       width: am5.percent(1),
  //       centerX: am5.percent(1),
  //       x: am5.percent(1),
  //       layout: this.root.gridLayout,
  //     })
  //   );

  //   var exporting = am5plugins_exporting.Exporting.new(this.root, {
  //     menu: am5plugins_exporting.ExportingMenu.new(this.root, {}),
  //   });

  //   legend.data.setAll(series.dataItems[0].get("children"));
  //   legend.valueLabels.template.set("forceHidden", true);
  //   series.set("selectedDataItem", series.dataItems[0]);
  //   // Make stuff animate on load
  //   series.appear(1000, 100);
  // }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.entityData ? this.first === this.entityData.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.entityData ? this.first === 0 : true;
  }

  exportEntityExcel() {
    import('xlsx').then((xlsx) => {
      // Filter out only the desired columns from entityData
      const filteredData = this.entityData.map(entity => {
        return {
          Text: entity.Text,
          Category: entity.Category,
          Type: entity.Type,
          Score: entity.Score
        };
      });

      const worksheet = xlsx.utils.json_to_sheet(filteredData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsEntityExcelFile(excelBuffer, 'knowledgeGraphEntities');
    });
  }

  exportRelationExcel() {
    import('xlsx').then((xlsx) => {
      // Filter out only the desired columns from entityData
      const filteredData = this.relationData.map(relation => {
        return {
          Realtion_ID: relation.PMID,
          ENTITY_1: relation.ENTITY_1,
          TYPE_1: relation.TYPE_1,
          RELATION: relation.RELATION,
          ENTITY_2: relation.ENTITY_2,
          TYPE_2: relation.TYPE_2,
          Realtion_Text: relation.EVIDENCE_TEXT
        };
      });

      const worksheet = xlsx.utils.json_to_sheet(filteredData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsEntityExcelFile(excelBuffer, 'knowledgeGraphRelations');
    });
  }

  saveAsEntityExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  clear(table: Table) {
    table.clear();
  }

  reload() {
    window.location.reload();
  }

}
