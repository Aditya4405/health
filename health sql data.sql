-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: healthcare_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (3,NULL,'Add your name in the body',NULL,'USER'),(4,NULL,'Add your name in the body',NULL,'USER'),(5,'aditya@example.com','Aditya','$2a$10$vu7AjOwpqJ4nk1U1PQv1.OkONAO5o5l4Ns7dbr53b8E8mli8LnO1C','USER'),(6,'akanksha@example.com','Akanksha','$2a$10$WyoPvYGSIrxnV.IOC.RReu2HNX2a7TrSqDJPUiEN.CzrkI2k8Dk3u','USER'),(7,'adityach@example.com','Aditya Chauhan','$2a$10$Zb.fZOZyVITcQ4t7nicZYOn64Ev1gw0zGFEO9bq6OVJlN8ZDgA9f2','USER');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `mobile_no` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'aditya+test1@example.com','Aditya Srivastava','$2a$10$NItqyg7yvuIx7cX/1b.sPOO85ql.P9SuSmSCuBJXN4aa/UGBDNCWq','patient','2002-05-10','Aditya','Male','Prajapati','9876543210'),(2,'adisrii1@gmail.com','Aditya Srivastava','$2a$10$PmXiLx6f7rNSBUPDUYaqzeWT8sBJ/FQcHK7ClvM5gJXpJ1rwxJHOK','USER',NULL,NULL,NULL,NULL,NULL),(3,'adityach@gmail.com','Aditya Chauhan','$2a$10$YOu61E50wdPi4vsWK6wfXukSjba12Tk/v2BuOuJ33karvSjyqSKM2','USER',NULL,NULL,NULL,NULL,NULL),(4,'aditya@example.com',NULL,'$2a$10$x8ZuzJuJ.Pp/.pR9/n2dMuw59eHdvKJYhAhG7lJgU0h2lImTzqMcS','USER','2002-05-10','Aditya','Male','Prajapati','9876543210'),(5,'adityasriiiiiiii@gmail.com',NULL,'$2a$10$J6nCqPA3VXwWZxpkL//JiOY/h.2hTJ3r3gI82BEBdIGMLVsSMO.b.','USER','2004-07-22','Aditya','Male',' Srivastava','9876543210'),(6,'akanksha12345@gmail.com',NULL,'$2a$10$XinL4OeixEPeSxbNI7nJC.6LMO3infOL4.2sS9zHmpPo7XmXPgF7i','USER','2004-11-20','Akanksha','Female','Devi','9876543210');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-21 16:19:12
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cloud_health
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `interpretation` varchar(255) DEFAULT NULL,
  `original_file_name` varchar(255) DEFAULT NULL,
  `reference_range` varchar(255) DEFAULT NULL,
  `report_type` varchar(255) DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL,
  `stored_path` varchar(255) DEFAULT NULL,
  `test_name` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `parsed_json` text,
  `ai_insights` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,NULL,'BLOOD REPORT.pdf',NULL,'Blood Report','NORMAL','uploads\\1763806572598_BLOOD REPORT.pdf','Complete Blood Analysis','2025-11-22 15:46:13.462645',6,'{\"rawTextSample\":\"Report Status     \\nMale \\n21 Years: \\n: \\n: \\n: \\nAge \\nGender \\nReported         \\nP \\n16/11/2025   2:27:00PM \\nDr. RAM KISHOR \\n491742770 \\nMr. AKSHAYA  KUMAR: \\n: \\n: \\n: \\n: \\nName         \\nLab No.     \\nRef By  \\nCollected        \\nA/c Status Final \\n16/11/2025  6:07:11PM \\nPaliwal Diagnostics Pvt. Ltd. \\n117/H-1/02 ,Pandu Nagar Kanpur, Uttar  \\nPradesh - 208005 \\n::Collected at            Processed at             AMBEDKARPURAM COLLECTION CENTRE \\nTest Report       \\nTest Name Results Units Bio. Ref. Interval \\nHEPATITIS B SURFACE ANTIGEN (HBsAg) RAPID  \\nSCREENING TEST \\n(Sandwich Immunochromatography) \\nNon-ReactiveNon-Reactive \\nInterpretation \\n------------------------------------------------------------------- \\n| RESULT       | REMARKS                                            | \\n|--------------|----------------------------------------------------| \\n| Reactive     | Indicates presence of Hepatitis B Surface Antigen. | \\n|--------------|----------------------------------------------------| \\n| Non-Reactive | I\",\"ANA\":\"anaging director                           \",\"HBsAg\":\"hbsag) rapid  \\nscreening test \\n(sandwich immu\",\"summary_abnormal_count\":0}',NULL),(2,NULL,'BLOOD REPORT.pdf',NULL,'Blood Report','NORMAL','uploads\\1763807383352_BLOOD REPORT.pdf','Complete Blood Analysis','2025-11-22 15:59:43.526734',6,'{\"rawTextSample\":\"Report Status     \\nMale \\n21 Years: \\n: \\n: \\n: \\nAge \\nGender \\nReported         \\nP \\n16/11/2025   2:27:00PM \\nDr. RAM KISHOR \\n491742770 \\nMr. AKSHAYA  KUMAR: \\n: \\n: \\n: \\n: \\nName         \\nLab No.     \\nRef By  \\nCollected        \\nA/c Status Final \\n16/11/2025  6:07:11PM \\nPaliwal Diagnostics Pvt. Ltd. \\n117/H-1/02 ,Pandu Nagar Kanpur, Uttar  \\nPradesh - 208005 \\n::Collected at            Processed at             AMBEDKARPURAM COLLECTION CENTRE \\nTest Report       \\nTest Name Results Units Bio. Ref. Interval \\nHEPATITIS B SURFACE ANTIGEN (HBsAg) RAPID  \\nSCREENING TEST \\n(Sandwich Immunochromatography) \\nNon-ReactiveNon-Reactive \\nInterpretation \\n------------------------------------------------------------------- \\n| RESULT       | REMARKS                                            | \\n|--------------|----------------------------------------------------| \\n| Reactive     | Indicates presence of Hepatitis B Surface Antigen. | \\n|--------------|----------------------------------------------------| \\n| Non-Reactive | I\",\"ANA\":\"anaging director                           \",\"HBsAg\":\"hbsag) rapid  \\nscreening test \\n(sandwich immu\",\"summary_abnormal_count\":0}',NULL),(3,NULL,'BLOOD REPORT.pdf',NULL,'Blood Report','NORMAL','uploads\\1763808408965_BLOOD REPORT.pdf','Complete Blood Analysis','2025-11-22 16:16:49.925428',6,'{\"rawTextSample\":\"Report Status     \\nMale \\n21 Years: \\n: \\n: \\n: \\nAge \\nGender \\nReported         \\nP \\n16/11/2025   2:27:00PM \\nDr. RAM KISHOR \\n491742770 \\nMr. AKSHAYA  KUMAR: \\n: \\n: \\n: \\n: \\nName         \\nLab No.     \\nRef By  \\nCollected        \\nA/c Status Final \\n16/11/2025  6:07:11PM \\nPaliwal Diagnostics Pvt. Ltd. \\n117/H-1/02 ,Pandu Nagar Kanpur, Uttar  \\nPradesh - 208005 \\n::Collected at            Processed at             AMBEDKARPURAM COLLECTION CENTRE \\nTest Report       \\nTest Name Results Units Bio. Ref. Interval \\nHEPATITIS B SURFACE ANTIGEN (HBsAg) RAPID  \\nSCREENING TEST \\n(Sandwich Immunochromatography) \\nNon-ReactiveNon-Reactive \\nInterpretation \\n------------------------------------------------------------------- \\n| RESULT       | REMARKS                                            | \\n|--------------|----------------------------------------------------| \\n| Reactive     | Indicates presence of Hepatitis B Surface Antigen. | \\n|--------------|----------------------------------------------------| \\n| Non-Reactive | I\",\"ANA\":\"anaging director                           \",\"HBsAg\":\"hbsag) rapid  \\nscreening test \\n(sandwich immu\",\"summary_abnormal_count\":0}',NULL),(4,NULL,'BLOOD REPORT.pdf',NULL,'Blood Report','NORMAL','C:\\Users\\Aditya\\Downloads\\cloud-health-backend\\cloud-health-backend\\uploads\\1763828821907_BLOOD REPORT.pdf','Complete Blood Analysis','2025-11-22 21:57:02.673244',8,'{\"rawTextSample\":\"Report Status     \\nMale \\n21 Years: \\n: \\n: \\n: \\nAge \\nGender \\nReported         \\nP \\n16/11/2025   2:27:00PM \\nDr. RAM KISHOR \\n491742770 \\nMr. AKSHAYA  KUMAR: \\n: \\n: \\n: \\n: \\nName         \\nLab No.     \\nRef By  \\nCollected        \\nA/c Status Final \\n16/11/2025  6:07:11PM \\nPaliwal Diagnostics Pvt. Ltd. \\n117/H-1/02 ,Pandu Nagar Kanpur, Uttar  \\nPradesh - 208005 \\n::Collected at            Processed at             AMBEDKARPURAM COLLECTION CENTRE \\nTest Report       \\nTest Name Results Units Bio. Ref. Interval \\nHEPATITIS B SURFACE ANTIGEN (HBsAg) RAPID  \\nSCREENING TEST \\n(Sandwich Immunochromatography) \\nNon-ReactiveNon-Reactive \\nInterpretation \\n------------------------------------------------------------------- \\n| RESULT       | REMARKS                                            | \\n|--------------|----------------------------------------------------| \\n| Reactive     | Indicates presence of Hepatitis B Surface Antigen. | \\n|--------------|----------------------------------------------------| \\n| Non-Reactive | I\",\"ANA\":\"anaging director                           \",\"HBsAg\":\"hbsag) rapid  \\nscreening test \\n(sandwich immu\",\"summary_abnormal_count\":0}',NULL),(5,NULL,'BLOOD REPORT.pdf',NULL,NULL,NULL,'C:\\Users\\Aditya\\Downloads\\cloud-health-backend\\cloud-health-backend\\uploads\\1763831968535_BLOOD REPORT.pdf',NULL,'2025-11-22 22:49:29.240382',8,'{\"originalFileName\":\"BLOOD REPORT.pdf\",\"storedPath\":\"C:\\\\Users\\\\Aditya\\\\Downloads\\\\cloud-health-backend\\\\cloud-health-backend\\\\uploads\\\\1763831968535_BLOOD REPORT.pdf\"}','[\"AI Interpretation will appear here soon.\",\"Your report data is being processed.\"]'),(6,NULL,'blood report1.pdf',NULL,NULL,NULL,'C:\\Users\\Aditya\\Downloads\\cloud-health-backend\\cloud-health-backend\\uploads\\1763885907020_blood_report1.pdf',NULL,'2025-11-23 13:49:21.065115',8,'{\"originalFileName\":\"blood report1.pdf\",\"storedPath\":\"C:\\\\Users\\\\Aditya\\\\Downloads\\\\cloud-health-backend\\\\cloud-health-backend\\\\uploads\\\\1763885907020_blood_report1.pdf\",\"RS * ISO\":\"9001\",\"Age/Gender ‘\":\"21\",\"Reg No *\":\"190425207\",\"On = 16-04-2025\":\"13\",\"SampleID +\":\"160425310\",\"HAEMOGLOBIN\":\"15.0\",\"HAEMATOCRIT\":\"47.0\",\"R.B.C COUNT\":\"5.71\",\"MCV\":\"82.3\",\"MCH\":\"26.3\",\"MCHC\":\"31.9\",\"PLATELET COUNT\":\"154\",\"TLC\":\"5.43\",\"Neutrophils >\":\"62.2\",\"Lymphocytes >\":\"29.1\",\"Monocytes\":\"7.4\",\"Eosinophils\":\"0.7\",\"Basophils\":\"0.6\",\"Print Date 20-04-2025\":\"13\",\"individual assay procecures\":\"33\",\"NEW DELHI -\":\"16\",\"22, Noida (UP)\":\"9512210826\",\"Sn * ISO\":\"9001\",\"Reg No ‘\":\"190425207\",\"Reported On 16-04-2025\":\"13\",\"rate (mm in\":\"1\",\"17-50 yr\":\"12\",\"51-60 yr\":\"19\",\">70 yr\":\"35\",\"61-70\":\"20\",\"}.\":\"3\",\"Khannie Z SSRs\":\"4\",\"AMON\":\"0000\",\"REACTIVE PROTEIN -\":\"3.62\",\"RHEUMATOID FACTOR -\":\"6.9\",\"Tint Date\":\"6\",\"individual assay procedures\":\"35\",\"S SES RS\":\"4\",\"On = 17-04-2025\":\"08\",\"ANTI CCP\":\"9.63\",\"> Khan\":\"2\",\"NUCLEAR ANTIBODY —\":\"0.50\",\"On = 20-04-2025\":\"15\",\"arm of chromosome\":\"6\",\"L SSRs ISO\":\"9001\",\"On = 21-04-2025\":\"07\",\"Sample ID *\":\"190425207\",\"BLOOD UREA\":\"19.00\",\"CREATININE\":\"0.79\",\"URIC ACID\":\"5.54\",\"SODIUM\":\"139.00\",\"POTASSIUM\":\"4.90\",\"Print Date 21-04-2025\":\"07\",\"and oer investvalions.\":\"2\",\"&-\":\"35\",\"SampleID = +\":\"190425207\",\"S. BILIRUBIN (TOTAL)\":\"0.46\",\"S. BILIRUBIN (DIRECT)\":\"0.14\",\"S. BILIRUBIN (INDIRECT)\":\"0.32\",\"S.G.O.T. (AST)\":\"28.00\",\"S.G.P.T. (ALT)\":\"32.00\",\"ALKALINE PHOSPHATASE\":\"74.18\",\"rs SES RS\":\"4\",\"O00\":\"000\",\"CHOLESTEROL\":\"154.00\",\"TRIGLYCERIDE\":\"70.00\",\"HDL\":\"52.00\",\"VLDL\":\"14.00\",\"LDL\":\"88.00\",\"LDL/HDL RATIO\":\"1.69\",\"CHOLESTEROL /HDL RATIO\":\"2.96\",\"Desirable Less than\":\"200\",\"High Risk\":\"239\",\"individual assay prooscures\":\"35\",\"Reported On 20-04-2025\":\"15\",\"PARATHYROID HORMONE\":\"63.3\",\"VITAMIN B12, SERUM\":\"226.00\",\"VITAMIN D,\":\"25\",\"Khan’ - Sn\":\"5\",\"only and have\":\"20\",\"MAM\":\"00000\",\"TSH\":\"1.29\",\"1-4 days\":\"1.00\",\"(1)\":\"4.2\",\"peak levels between\":\"2\"}','[\"AI Interpretation will appear here soon.\",\"Your report data is being processed.\",\"RS * ISO: 9001\",\"Age/Gender ‘: 21\",\"Reg No *: 190425207\",\"On = 16-04-2025: 13\",\"SampleID +: 160425310\"]'),(7,NULL,'blood report1.pdf','COMPLETE BLOOD COUNT (CBC)','Sample Type ‘ EDTA Whole Blood Client Name ‘ SPORT INJURY CENTER',NULL,'C:\\Users\\Aditya\\Downloads\\cloud-health-backend\\cloud-health-backend\\uploads\\1763888524533_blood_report1.pdf','Dr. Khanna\'s ATHCARE','2025-11-23 14:33:30.822794',8,'{\"originalFileName\":\"blood report1.pdf\",\"storedPath\":\"C:\\\\Users\\\\Aditya\\\\Downloads\\\\cloud-health-backend\\\\cloud-health-backend\\\\uploads\\\\1763888524533_blood_report1.pdf\",\"referenceRange\":\"COMPLETE BLOOD COUNT (CBC)\",\"testName\":\"Dr. Khanna\'s ATHCARE\",\"reportType\":\"Sample Type ‘ EDTA Whole Blood Client Name ‘ SPORT INJURY CENTER\",\"RBC\":\"5.71\",\"Platelet\":\"154\",\"result\":\"6\"}',NULL),(8,NULL,'WhatsApp Image 2025-11-21 at 14.45.00_5dccdbc1.jpg','','','','C:\\Users\\Aditya\\Downloads\\cloud-health-backend\\cloud-health-backend\\uploads\\1764439253619_WhatsApp_Image_2025-11-21_at_14.45.00_5dccdbc1.jpg','','2025-11-29 23:30:53.746492',9,'{originalFileName=WhatsApp Image 2025-11-21 at 14.45.00_5dccdbc1.jpg, storedPath=C:\\Users\\Aditya\\Downloads\\cloud-health-backend\\cloud-health-backend\\uploads\\1764439253619_WhatsApp_Image_2025-11-21_at_14.45.00_5dccdbc1.jpg, line_0=[PDF TEXT EXTRACTION ERROR]}','[AI Interpretation will appear here soon., Your report data is being processed.]'),(9,NULL,'BLOOD REPORT.pdf','','','','C:\\Users\\Aditya\\Downloads\\cloud-health-backend\\cloud-health-backend\\uploads\\1764440197143_BLOOD_REPORT.pdf','','2025-11-29 23:46:37.888009',9,'{originalFileName=BLOOD REPORT.pdf, storedPath=C:\\Users\\Aditya\\Downloads\\cloud-health-backend\\cloud-health-backend\\uploads\\1764440197143_BLOOD_REPORT.pdf, line_0=Report Status, line_1=Male, line_2=21 Years:, line_3=:, line_4=:, line_5=:}','[AI Interpretation will appear here soon., Your report data is being processed.]'),(10,NULL,'BLOOD REPORT.pdf','','','','C:\\Users\\Aditya\\Downloads\\cloud-health-backend\\cloud-health-backend\\uploads\\1764441880390_BLOOD_REPORT.pdf','','2025-11-30 00:14:41.009878',9,'{originalFileName=BLOOD REPORT.pdf, storedPath=C:\\Users\\Aditya\\Downloads\\cloud-health-backend\\cloud-health-backend\\uploads\\1764441880390_BLOOD_REPORT.pdf, line_0=Report Status, line_1=Male, line_2=21 Years:, line_3=:, line_4=:, line_5=:}','[AI Interpretation will appear here soon., Your report data is being processed.]');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_entity`
--

DROP TABLE IF EXISTS `test_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_entity` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_entity`
--

LOCK TABLES `test_entity` WRITE;
/*!40000 ALTER TABLE `test_entity` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `dob` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `license_number` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'2025-11-19 00:55:30.243309','doctor@example.com','Doctor Aditya','$2a$10$Z2J6p8At3IhP..s/URaR8OGqVo1VvGH/P8keVqw5BCjbhGi9Y.4Em','DOCTOR',NULL,NULL,NULL,NULL,NULL,NULL),(3,'2025-11-19 01:32:49.812690','devi@gmail.com','Akanksha Devi','$2a$10$Hff/Yr5tsHj8ZZRf95W.P.dSMMgLLo.H5YO/tJb9GrAnBcr0PYi3.','DOCTOR',NULL,NULL,NULL,NULL,NULL,NULL),(4,'2025-11-19 01:45:11.740721','devi1@gmail.com','Akanksha Devi','$2a$10$SDLBlho9zh69Y/ZTlftPXuo.hY2jl6.28p8raYTVzXavMO92UwDAS','DOCTOR',NULL,NULL,NULL,NULL,NULL,NULL),(5,'2025-11-19 09:19:00.993609','2k23.cs2313644@gmail.com','Aditya Prajapati','$2a$10$lGMDl3Z94eehdj/4jF8o0.YtP2AzeoaDo9oS8V29IWtH.YVpj1l36','PATIENT',NULL,NULL,NULL,NULL,NULL,NULL),(6,'2025-11-21 14:25:56.541923','adityaprajapati4405@gmail.com',NULL,'$2a$10$7xUFFl84TJ63aqMCzVwjEeI72UPSxHGB3xwtWBCzX7RLBFzfxbKdm','PATIENT','2005-04-04','RAKESH','MALE','Prajapati',NULL,NULL),(7,'2025-11-21 15:27:05.807079','ankitprajapati2803@gmail.com',NULL,'$2a$10$At3Z.Wm/t809Zf9Ju.zmTONNiUo5tgRVDmTHOqeIz1QgXOEe/ciSm','PATIENT','2025-10-29','RAKESH','MALE','KUMAR',NULL,NULL),(8,'2025-11-22 21:38:09.932270','adityap4405@gmail.com',NULL,'$2a$10$TYRibtrWVD6jeJK3sBSUZulFEvpqUlZoLUvZEh0XcGh..E0SrDNYS','PATIENT','2005-04-04','Aditya','MALE','Prajapati',NULL,NULL),(9,'2025-11-29 20:42:34.084649','deviakanksha16@gmail.com',NULL,'$2a$10$mslUpOv1DqpK5KBW/atHOeXpUrKPAW/uovHAptMKdUy4iKInm5Twi','PATIENT','2004-11-20','Akanksha ','FEMALE','Devi ',NULL,'');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-21 16:19:12
