-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               9.1.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for sso
CREATE DATABASE IF NOT EXISTS `sso` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sso`;

-- Dumping structure for table sso.asuhan_keperawatan
CREATE TABLE IF NOT EXISTS `asuhan_keperawatan` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_rme` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `diagnosa_keperawatan` text COLLATE utf8mb4_unicode_ci,
  `intervensi_keperawatan` text COLLATE utf8mb4_unicode_ci,
  `implementasi_keperawatan` text COLLATE utf8mb4_unicode_ci,
  `nama_perawat` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nip_perawat` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_subjektif` text COLLATE utf8mb4_unicode_ci,
  `data_objektif` text COLLATE utf8mb4_unicode_ci,
  `evaluasi_subjektif` text COLLATE utf8mb4_unicode_ci,
  `evaluasi_objektif` text COLLATE utf8mb4_unicode_ci,
  `evaluasi_assessment` text COLLATE utf8mb4_unicode_ci,
  `evaluasi_planning` text COLLATE utf8mb4_unicode_ci,
  `lokasi` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sso.asuhan_keperawatan: ~0 rows (approximately)

-- Dumping structure for table sso.audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'CREATE, UPDATE, DELETE',
  `tableName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recordId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `changes` longtext COLLATE utf8mb4_unicode_ci COMMENT 'JSON representation of old vs new values',
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userName` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ipAddress` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sso.audit_logs: ~55 rows (approximately)
INSERT INTO `audit_logs` (`id`, `action`, `tableName`, `recordId`, `changes`, `userId`, `userName`, `ipAddress`, `created_at`) VALUES
	('004680ef-fa00-4add-b4ae-5dfa965b4b4d', 'LOGOUT', 'user', 'a51cda4f-3701-4f31-80b7-8e1cdc1862ff', '{"oldValues":null,"newValues":null}', 'a51cda4f-3701-4f31-80b7-8e1cdc1862ff', 'Terminal 1', 'unknown', '2026-06-25 08:23:32'),
	('01f7edcd-d001-4457-8bd6-2e72476572bb', 'LOGIN', 'user', '2c8f09e9-fef0-43d5-b337-714500799f11', '{"oldValues":null,"newValues":{"email":"bbkksoetta@gmail.com","role":"admin","wilayah":"Admin Center"}}', '2c8f09e9-fef0-43d5-b337-714500799f11', 'Kepala BBKK Soetta', 'unknown', '2026-06-25 08:24:24'),
	('05df6450-ca00-4984-ba64-eae86b1caf9c', 'LOGIN', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"perawat","wilayah":"terminal1a"}}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-06-12 01:22:22'),
	('08c25226-f8f5-40f0-a65d-54f9f0bc4917', 'LOGIN', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"perawat","wilayah":"terminal1a"}}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-06-18 07:37:12'),
	('0922669a-f56b-467a-84ed-be66b4989993', 'LOGOUT', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":null}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-05-29 02:18:14'),
	('0d44dac5-b323-4959-86d3-147f5e04c767', 'LOGIN', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"admin","wilayah":"terminal1"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-26 02:14:55'),
	('17e5aaaa-50f4-48ff-8568-92b405f40cfd', 'CREATE', 'registrasi_pasien', '34944bc9-84aa-49df-aa58-71e8d2e77e06', '{"newValues":{"id":"34944bc9-84aa-49df-aa58-71e8d2e77e06","tanggal_input":"2026-05-22T00:00:00.000Z","tipe_pasien":"Pelaku Perjalanan","no_referensi":"GA-441","perawat_nip":"9af649bd-19cb-4896-85ee-4866441f6b0e","perawat_nama":"ka@m.com","lokasi_kejadian":"Terminal 1B","no_rme":"RME-BBKK131791","nama_pasien":"haruman","tanggal_lahir":"2025-11-12T00:00:00.000Z","jenis_kelamin":"L","usia":1,"jenis_identitas":"WNI","nik":"1111111111111","paspor":"","alamat":"","no_telepon":"","bb":"","tb":"","tekanan_darah":"","tekanan_nadi":"","spo2":"","respiratory_rate":"","suhu_tubuh":"","gds":"","asam_urat":"","kolestrol":"","antigen":"Negatif","pcr":"Tidak Diambil","lab_lainnya":null,"dokter_nama":"dr. Iis Windasary","dokter_nip":"197708222006042001","anamnesa":"a","pemeriksaan_fisik":"","dokument_kesehatan":null,"gcs":null,"therapy":"a","icd_kode":"B35","icd_nama":"Dermatophytosis (Tinea Pedis)","kategori_pasien":null,"kategori_penyakit":"Menular","kondisi_khusus":"","pelayanan_karantina":"","tindakan_rujukan":"","created_by":"9af649bd-19cb-4896-85ee-4866441f6b0e","created_at":"2026-05-22T00:53:57.000Z","updated_at":"2026-05-22T00:53:57.000Z","deleted_at":null}}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', '127.0.0.1', '2026-05-22 00:53:58'),
	('1888923f-d474-499e-8a51-9d0709411f96', 'LOGIN', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"admin","wilayah":"terminal1"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 06:45:05'),
	('263c5454-51da-48b8-a7f4-481c0e981d49', 'LOGOUT', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":null}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-06-12 02:26:00'),
	('2bbb9040-c639-4bd3-9a04-3137d5a32210', 'LOGIN', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"admin","wilayah":"terminal1"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-26 01:46:13'),
	('2cb42b8d-7199-4e19-bca3-12c045d5a7bd', 'LOGIN', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"perawat","wilayah":"terminal1a"}}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-05-28 22:01:42'),
	('3664d11c-0710-4360-b273-2fdc79c3e247', 'LOGIN', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"perawat","wilayah":"terminal1a"}}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-05-28 20:15:48'),
	('44e8e31a-ab55-46d3-9a40-977525d42280', 'LOGOUT', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":null}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-26 01:59:38'),
	('48ad2c83-b431-4c83-8a68-021079dbd230', 'LOGIN', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"admin","wilayah":"terminal1"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 06:33:41'),
	('4bc82f7e-bff1-4625-a2ef-19ea50eeeee5', 'LOGIN', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"perawat","wilayah":"terminal1a"}}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-05-22 05:47:29'),
	('543cc59d-bd09-41ff-990a-a2fff25640bc', 'LOGOUT', 'user', 'a51cda4f-3701-4f31-80b7-8e1cdc1862ff', '{"oldValues":null,"newValues":null}', 'a51cda4f-3701-4f31-80b7-8e1cdc1862ff', 'Terminal 1', 'unknown', '2026-06-25 08:39:38'),
	('56f0f86d-0e58-4e31-b369-fc665da8ff7d', 'LOGOUT', 'user', '2c8f09e9-fef0-43d5-b337-714500799f11', '{"oldValues":null,"newValues":null}', '2c8f09e9-fef0-43d5-b337-714500799f11', 'Kepala BBKK Soetta', 'unknown', '2026-06-25 08:38:59'),
	('58ddef25-1c5d-427d-b303-c0b1a177dfc8', 'LOGIN', 'user', 'a51cda4f-3701-4f31-80b7-8e1cdc1862ff', '{"oldValues":null,"newValues":{"email":"Terminal1@bbkksoetta.com","role":"admin","wilayah":"Terminal 1"}}', 'a51cda4f-3701-4f31-80b7-8e1cdc1862ff', 'Terminal 1', 'unknown', '2026-06-25 08:22:42'),
	('5aa3baa3-f4df-4138-92f5-00a4e99ab10f', 'LOGIN', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"admin","wilayah":"terminal1"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 06:56:42'),
	('5bf661c6-cd8a-4318-a0fa-bcec6e4bd9dc', 'CREATE', 'registrasi_pasien', '8d2a3313-4741-42ce-ab0c-0e6e80f916ed', '{"newValues":{"id":"8d2a3313-4741-42ce-ab0c-0e6e80f916ed","tanggal_input":"2026-05-21T00:00:00.000Z","tipe_pasien":"Pegawai","no_referensi":"","perawat_nip":"","perawat_nama":"","lokasi_kejadian":"Terminal 2D","no_rme":"RME-BBKK929383","nama_pasien":"mamat","tanggal_lahir":"2026-05-13T00:00:00.000Z","jenis_kelamin":"L","usia":6,"jenis_identitas":"WNI","nik":"11","paspor":"","alamat":"","no_telepon":"","bb":"","tb":"","tekanan_darah":"","tekanan_nadi":"","spo2":"","respiratory_rate":"","suhu_tubuh":"","gds":"","asam_urat":"","kolestrol":"","antigen":"Negatif","pcr":"Tidak Diambil","lab_lainnya":null,"dokter_nama":"dr. Endang Sutisna","dokter_nip":"197407042014121003","anamnesa":"","pemeriksaan_fisik":"","dokument_kesehatan":null,"gcs":null,"therapy":"","icd_kode":"","icd_nama":"","kategori_pasien":null,"kategori_penyakit":"Tidak Menular","kondisi_khusus":"","pelayanan_karantina":"","tindakan_rujukan":"","created_by":"e3612913-c602-4e8b-ba40-2b0081675cb7","created_at":"2026-05-21T22:46:02.000Z","updated_at":"2026-05-21T22:46:02.000Z","deleted_at":null}}', 'e3612913-c602-4e8b-ba40-2b0081675cb7', 'kakaberani', '127.0.0.1', '2026-05-21 22:46:02'),
	('5c574f9a-4ebf-42e9-b02d-821be355017d', 'LOGIN', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"perawat","wilayah":"terminal1a"}}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-05-28 19:53:30'),
	('5cf6dfe0-854b-451a-b63a-d1a8c1937067', 'LOGIN', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"admin","wilayah":"terminal1"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 06:51:58'),
	('5d8fb5ca-af28-4ac7-90d1-36bba4c25de4', 'UPDATE', 'user', 'a51cda4f-3701-4f31-80b7-8e1cdc1862ff', '{"oldValues":{"name":"Terminal 1","email":"Terminal1@bbkksoetta.com","role":"admin","wilayah":"Terminal 1"},"newValues":{"name":"Terminal 1","email":"Terminal1@bbkksoetta.com","role":"pengguna","wilayah":"Terminal 1"}}', '2c8f09e9-fef0-43d5-b337-714500799f11', 'Kepala BBKK Soetta', 'unknown', '2026-06-25 08:38:57'),
	('643d3b44-b04e-4c5a-989c-acc388d9a6b8', 'CREATE', 'registrasi_pasien', '67be972b-fbd3-4a19-a7cc-ddaf5acb12ed', '{"newValues":{"id":"67be972b-fbd3-4a19-a7cc-ddaf5acb12ed","tanggal_input":"2026-05-22T00:00:00.000Z","tipe_pasien":"Pelaku Perjalanan","no_referensi":"","perawat_nip":"","perawat_nama":"","lokasi_kejadian":"Terminal 1A","no_rme":"RME-BBKK273836","nama_pasien":"aaaaaaaa","tanggal_lahir":null,"jenis_kelamin":"L","usia":null,"jenis_identitas":"WNI","nik":"141212","paspor":"","alamat":"","no_telepon":"","bb":"","tb":"","tekanan_darah":"","tekanan_nadi":"","spo2":"","respiratory_rate":"","suhu_tubuh":"","gds":"","asam_urat":"","kolestrol":"","antigen":"Negatif","pcr":"Tidak Diambil","lab_lainnya":"","dokter_nama":"","dokter_nip":"","anamnesa":"","pemeriksaan_fisik":"","dokument_kesehatan":"","gcs":"","therapy":"","icd_kode":"","icd_nama":"","kategori_pasien":null,"kategori_penyakit":"Tidak Menular","kondisi_khusus":"","pelayanan_karantina":"","tindakan_rujukan":"","pertanyaan_terbuka":"","created_by":"9af649bd-19cb-4896-85ee-4866441f6b0e","created_at":"2026-05-22T02:32:00.000Z","updated_at":"2026-05-22T02:32:00.000Z","deleted_at":null}}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', '127.0.0.1', '2026-05-22 02:32:01'),
	('64838f28-0a4a-4122-b40e-2cbb9eb6de11', 'LOGIN', 'user', '8c03b5f8-94a1-417d-b722-87310ccde9b7', '{"oldValues":null,"newValues":{"email":"Terminal2@bbkksoetta.com","role":"pengguna","wilayah":"Terminal 2"}}', '8c03b5f8-94a1-417d-b722-87310ccde9b7', 'Terminal 2', 'unknown', '2026-06-25 08:41:10'),
	('662e67d6-8631-4415-a0fe-c0fb0421ec32', 'LOGIN', 'user', 'a51cda4f-3701-4f31-80b7-8e1cdc1862ff', '{"oldValues":null,"newValues":{"email":"Terminal1@bbkksoetta.com","role":"pengguna","wilayah":"Terminal 1"}}', 'a51cda4f-3701-4f31-80b7-8e1cdc1862ff', 'Terminal 1', 'unknown', '2026-06-25 08:39:19'),
	('6c6e812a-a3ab-48fd-9a1d-2b94166ed18c', 'CREATE', 'user', 'fa5552f9-f437-4a9c-bd92-6628ae1341bd', '{"oldValues":null,"newValues":{"name":"Terminal 3","email":"Terminal3@bbkksoetta.com","role":"admin","wilayah":"Terminal 3"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 07:03:45'),
	('6eb93a45-9cc2-4a0b-9119-ddd87dc9d4f5', 'LOGIN', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"admin","wilayah":"terminal1"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-26 02:36:01'),
	('6f2dbbe7-c984-4585-8f55-a4b5ffb13a58', 'UPDATE', 'user', '8c03b5f8-94a1-417d-b722-87310ccde9b7', '{"oldValues":{"name":"Terminal 2","email":"Terminal2@bbkksoetta.com","role":"pengguna","wilayah":"Terminal 2"},"newValues":{"name":"Terminal 2","email":"Terminal2@bbkksoetta.com","role":"admin","wilayah":"Terminal 2"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 07:03:06'),
	('6f7c13f4-0c48-4e5d-82d4-9b43012614fe', 'LOGIN', 'user', 'a6645e6c-7cbd-4d79-8af5-9ee34e2671bb', '{"oldValues":null,"newValues":{"email":"adminbbkksoetta@gmail.com","role":"admin","wilayah":"timker1"}}', 'a6645e6c-7cbd-4d79-8af5-9ee34e2671bb', 'BBKK SOETTA', 'unknown', '2026-05-29 02:12:05'),
	('75603994-0d5c-4d1b-b386-5004a5c42b38', 'LOGIN', 'user', '8c03b5f8-94a1-417d-b722-87310ccde9b7', '{"oldValues":null,"newValues":{"email":"Terminal2@bbkksoetta.com","role":"admin","wilayah":"Terminal 2"}}', '8c03b5f8-94a1-417d-b722-87310ccde9b7', 'Terminal 2', 'unknown', '2026-06-25 08:23:38'),
	('75e520c5-c021-4232-ac0a-eb395564f98c', 'LOGOUT', 'user', 'a6645e6c-7cbd-4d79-8af5-9ee34e2671bb', '{"oldValues":null,"newValues":null}', 'a6645e6c-7cbd-4d79-8af5-9ee34e2671bb', 'BBKK SOETTA', 'unknown', '2026-05-29 02:15:24'),
	('7b503ae2-b497-43c2-99ca-997da267b9d0', 'LOGIN', 'user', '2c8f09e9-fef0-43d5-b337-714500799f11', '{"oldValues":null,"newValues":{"email":"bbkksoetta@gmail.com","role":"admin","wilayah":"Admin Center"}}', '2c8f09e9-fef0-43d5-b337-714500799f11', 'Kepala BBKK Soetta', 'unknown', '2026-06-25 08:42:20'),
	('8277cc4e-51d1-4cbd-b08a-19f93f136e47', 'CREATE', 'user', '2c8f09e9-fef0-43d5-b337-714500799f11', '{"oldValues":null,"newValues":{"name":"Kepala BBKK Soetta","email":"bbkksoetta@gmail.com","role":"admin","wilayah":"Admin Center"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 07:04:37'),
	('8474477a-cefc-4cb1-9cae-f1f2699c23d8', 'LOGOUT', 'user', '8c03b5f8-94a1-417d-b722-87310ccde9b7', '{"oldValues":null,"newValues":null}', '8c03b5f8-94a1-417d-b722-87310ccde9b7', 'Terminal 2', 'unknown', '2026-06-25 08:42:01'),
	('849fe53d-1e7b-4566-8b0e-6feee5041af1', 'LOGOUT', 'user', 'fa5552f9-f437-4a9c-bd92-6628ae1341bd', '{"oldValues":null,"newValues":null}', 'fa5552f9-f437-4a9c-bd92-6628ae1341bd', 'Terminal 3', 'unknown', '2026-06-25 08:24:19'),
	('84f5fce2-4bcf-422c-b805-c754267735a1', 'LOGOUT', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":null}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 08:22:19'),
	('872068f1-65ed-4f3d-8ab4-f1e86ce78c25', 'UPDATE', 'user', 'fa5552f9-f437-4a9c-bd92-6628ae1341bd', '{"oldValues":{"name":"Terminal 3","email":"Terminal3@bbkksoetta.com","role":"admin","wilayah":"Terminal 3"},"newValues":{"name":"Terminal 3","email":"Terminal3@bbkksoetta.com","role":"pengguna","wilayah":"Terminal 3"}}', '2c8f09e9-fef0-43d5-b337-714500799f11', 'Kepala BBKK Soetta', 'unknown', '2026-06-25 08:38:46'),
	('87411da7-71b6-4c9d-8b2c-08c651e305e4', 'CREATE', 'user', 'a51cda4f-3701-4f31-80b7-8e1cdc1862ff', '{"oldValues":null,"newValues":{"name":"Terminal 1","email":"Terminal1@bbkksoetta.com","role":"admin","wilayah":"Terminal 1"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 07:02:27'),
	('889f0cb1-4555-4ee2-80a0-b7c5fc1a582d', 'LOGOUT', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":null}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-05-28 19:53:53'),
	('8baa7d0c-4eb0-463c-ad6d-e87e67bfcfe4', 'LOGOUT', 'user', '8c03b5f8-94a1-417d-b722-87310ccde9b7', '{"oldValues":null,"newValues":null}', '8c03b5f8-94a1-417d-b722-87310ccde9b7', 'Terminal 2', 'unknown', '2026-06-25 08:23:55'),
	('8c7eb4c3-2eb5-43b3-b28c-c4268f598b69', 'LOGOUT', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":null}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-26 02:15:06'),
	('9003c2dc-2e74-4a90-b3e2-10e7cc7bdb2c', 'LOGOUT', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":null}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-26 02:35:36'),
	('94d3338e-20f0-40d2-9209-099419d92fd9', 'LOGIN', 'user', 'a797f1d7-e09b-4a42-8a42-066fd8a155a0', '{"oldValues":null,"newValues":{"email":"bbkksoetta@gmail.com","role":"admin","wilayah":"timker1"}}', 'a797f1d7-e09b-4a42-8a42-066fd8a155a0', 'BBKK SOETTA', 'unknown', '2026-05-29 02:18:23'),
	('9cba406b-975a-48d5-9700-24d72effebc2', 'UPDATE', 'user', '8c03b5f8-94a1-417d-b722-87310ccde9b7', '{"oldValues":{"name":"Terminal 2","email":"Terminal2@bbkksoetta.com","role":"admin","wilayah":"Terminal 2"},"newValues":{"name":"Terminal 2","email":"Terminal2@bbkksoetta.com","role":"pengguna","wilayah":"Terminal 2"}}', '2c8f09e9-fef0-43d5-b337-714500799f11', 'Kepala BBKK Soetta', 'unknown', '2026-06-25 08:38:52'),
	('9f4f57ea-b49a-41f5-8d40-650d0ede6cca', 'LOGOUT', 'user', '07784acc-686f-4eca-9cf3-dea0997c786a', '{"oldValues":null,"newValues":null}', '07784acc-686f-4eca-9cf3-dea0997c786a', 'Haruman', 'unknown', '2026-06-25 06:56:30'),
	('a8558213-dee9-4811-bfdc-7fa7a51df29e', 'LOGOUT', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":null}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 06:46:31'),
	('a86d8080-b015-43de-b19e-55a02289ad0a', 'CREATE', 'user', '07784acc-686f-4eca-9cf3-dea0997c786a', '{"oldValues":null,"newValues":{"name":"Haruman","email":"ha@m.com","role":"pengguna","wilayah":"Terminal 2"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 06:46:26'),
	('ae19dd36-8cda-4a9c-ad74-444d6bc70e18', 'LOGOUT', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":null}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-05-22 06:32:10'),
	('ae5e4eee-7d21-4ee2-b8a8-81890c0d3369', 'LOGIN', 'user', 'fa5552f9-f437-4a9c-bd92-6628ae1341bd', '{"oldValues":null,"newValues":{"email":"Terminal3@bbkksoetta.com","role":"admin","wilayah":"Terminal 3"}}', 'fa5552f9-f437-4a9c-bd92-6628ae1341bd', 'Terminal 3', 'unknown', '2026-06-25 08:24:05'),
	('b1f3912f-866e-4751-aa5e-e07996c66a41', 'LOGIN', 'user', 'a797f1d7-e09b-4a42-8a42-066fd8a155a0', '{"oldValues":null,"newValues":{"email":"bbkksoetta@gmail.com","role":"admin","wilayah":"timker1"}}', 'a797f1d7-e09b-4a42-8a42-066fd8a155a0', 'BBKK SOETTA', 'unknown', '2026-05-29 02:17:12'),
	('c5ff269b-48e8-4ca1-905c-0a92a310029e', 'LOGIN', 'user', '9af649bd-19cb-4896-85ee-4866441f6b0e', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"admin","wilayah":"terminal1a"}}', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'unknown', '2026-05-22 06:32:41'),
	('d75748fc-56aa-45ab-b88e-272290b25fca', 'CREATE', 'user', '8c03b5f8-94a1-417d-b722-87310ccde9b7', '{"oldValues":null,"newValues":{"name":"Terminal 2","email":"Terminal2@bbkksoetta.com","role":"pengguna","wilayah":"Terminal 2"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-25 07:02:50'),
	('de12b24b-01ca-4d7a-97fd-40a8bff5f4f1', 'LOGIN', 'user', '63ff51da-705f-11f1-acc9-bc24116dc1cc', '{"oldValues":null,"newValues":{"email":"ka@m.com","role":"admin","wilayah":"terminal1"}}', '63ff51da-705f-11f1-acc9-bc24116dc1cc', 'ka@m.com', 'unknown', '2026-06-26 02:24:29'),
	('f7720752-5775-4324-a45f-dc07e3f7efd3', 'LOGIN', 'user', '07784acc-686f-4eca-9cf3-dea0997c786a', '{"oldValues":null,"newValues":{"email":"ha@m.com","role":"pengguna","wilayah":"Terminal 2"}}', '07784acc-686f-4eca-9cf3-dea0997c786a', 'Haruman', 'unknown', '2026-06-25 06:46:39');

-- Dumping structure for table sso.bmhp
CREATE TABLE IF NOT EXISTS `bmhp` (
  `id` int NOT NULL,
  `no_urut` int NOT NULL,
  `nama_bmhp` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `satuan` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sso.bmhp: ~106 rows (approximately)
INSERT INTO `bmhp` (`id`, `no_urut`, `nama_bmhp`, `satuan`, `stock`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 138, 'Abocath No 18', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(2, 139, 'Abocath No 20', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(3, 140, 'Abocath No 22', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(4, 141, 'Abocath No 24', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(5, 142, 'Alkohol 70% 5 L', 'BOTOL', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(6, 143, 'Alkohol Swab', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(7, 144, 'Ambubag', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(8, 145, 'Apron Plastik', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(9, 146, 'Aquadest 1 L', 'BOTOL', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(10, 147, 'Aquadest 25 ml', 'FLS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(11, 148, 'Baterai AA', 'PACK', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(12, 149, 'Baterai AAA', 'PACK', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(13, 150, 'Benang Catgut Tanpa Jarum', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(14, 151, 'Bisacodyl', 'TABLET', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(15, 152, 'Bisturi', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(16, 153, 'Catgut Jarum Jahit', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(17, 154, 'Cervical Collar Neck', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(18, 155, 'Condom Catheter', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(19, 156, 'Cromic', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(20, 157, 'Diapers', 'PACK', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(21, 158, 'Duk Rapat 25x25 cm', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(22, 159, 'Elastic Bandage 3 inch', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(23, 160, 'Elastic Bandage 4 inch', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(24, 161, 'Elektroda Monitor', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(25, 162, 'Female Catheter', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(26, 163, 'Foley Catheter No 12', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(27, 164, 'Foley Catheter No 14', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(28, 165, 'Foley Catheter No 16', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(29, 166, 'Foley Catheter No 18', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(30, 167, 'Goedel No 0', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(31, 168, 'Goedel No 1', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(32, 169, 'Goedel No 3', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(33, 170, 'Goedel No 4', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(34, 171, 'Goedel No 5', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(35, 172, 'Handasplas Satuan', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(36, 173, 'Handsanitizer 500 ml', 'BOTOL', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(37, 174, 'Handsaplas Rol', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(38, 175, 'Handscoon Steril Ukuran 6.5', 'PASANG', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(39, 176, 'Handscoon Steril Ukuran 7.5', 'PASANG', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(40, 177, 'Handscoon Steril Ukuran 7', 'PASANG', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(41, 178, 'Handscoon Ukuran L (Sensi)', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(42, 179, 'Handscoon Ukuran M (Sensi)', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(43, 180, 'Handscoon Ukuran S (Sensi)', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(44, 181, 'Hansaplast Roll', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(45, 182, 'Hufaneuron', 'TABLET', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(46, 183, 'Hypafix', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(47, 184, 'Infus Set Anak', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(48, 185, 'Infus Set Dewasa', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(49, 186, 'Kain Putih Penutup Jenazah', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(50, 187, 'Kantong Jenazah', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(51, 188, 'Kantong Urine / Urine Bag', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(52, 189, 'Kassa Gulung 2.5 x 10 cm', 'ROLL', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(53, 190, 'Kassa Gulung Besar', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(54, 191, 'Kassa Steril', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(55, 192, 'Kateter Urine', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(56, 193, 'Kertas ECG', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(57, 194, 'Kertas EKG Panjang', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(58, 195, 'Kertas Thermal', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(59, 196, 'Lancet Accu-Chek', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(60, 197, 'Masker', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(61, 198, 'Micropore Besar', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(62, 199, 'Micropore Kecil', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(63, 200, 'Micropore Sedang', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(64, 201, 'Micropore Tanpa Dispenser', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(65, 202, 'Mitela', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(66, 203, 'Nasal Cannule Anak', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(67, 204, 'Nasal Cannule Dewasa', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(68, 205, 'Nebulizer Mask Size L', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(69, 206, 'Nebulizer Mask Size M', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(70, 207, 'Nebulizer Mask Size XL', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(71, 208, 'Needle Terumo Uk 21', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(72, 209, 'NGT No 16', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(73, 210, 'Nifedipin Tablet', 'TABLET', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(74, 211, 'NRM', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(75, 212, 'Pad AED Zoll', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(76, 213, 'Pampers', 'PACK', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(77, 214, 'Plastik Klip Besar', 'PACK', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(78, 215, 'Plastik Klip Kecil', 'PACK', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(79, 216, 'Plastik Klip Sedang', 'PACK', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(80, 217, 'Plester Infus Transparan', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(81, 218, 'Povidon Iodine 30 ml', 'BOTOL', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(82, 219, 'Pulmicort Inh', 'AMPUL', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(83, 220, 'Safety Box', 'KARTON', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(84, 221, 'Selang Nebu Anak', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(85, 222, 'Silk Jarum Jahit', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(86, 223, 'Sofratulle', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(87, 224, 'Spatel Kayu', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(88, 225, 'Spuit 1 cc', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(89, 226, 'Spuit 10 cc', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(90, 227, 'Spuit 20 cc', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(91, 228, 'Spuit 3 cc', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(92, 229, 'Spuit 5 cc', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(93, 230, 'Spuit 50 cc', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(94, 231, 'Stik HB', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(95, 232, 'Suction Catheter No 12', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(96, 233, 'Suction Catheter No 14', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(97, 234, 'Suction Catheter No 6', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(98, 235, 'Test Strip Cholesterol', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(99, 236, 'Test Strip Glucose', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(100, 237, 'Test Strip Gula Prufen', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(101, 238, 'Test Strip Uric Acid', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(102, 239, 'Threeway Connector Infus', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(103, 240, 'Tourniquet', 'PCS', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(104, 241, 'Underpad', 'PACK', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(105, 242, 'VTM', 'PACK', NULL, '2026-01-22 19:28:17', NULL, NULL),
	(106, 243, 'Wing Needle', 'BOX', NULL, '2026-01-22 19:28:17', NULL, NULL);

-- Dumping structure for table sso.bmhp_pasien
CREATE TABLE IF NOT EXISTS `bmhp_pasien` (
  `id` char(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_rme` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_bmhp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jumlah` int DEFAULT NULL,
  `created_by` char(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sso.bmhp_pasien: ~8 rows (approximately)
INSERT INTO `bmhp_pasien` (`id`, `no_rme`, `nama_bmhp`, `jumlah`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
	('01b2a272-16cc-11f1-a6fa-24b2b9797bc8', 'RME-BBKK890338', 'Ambubag', NULL, 'f0019abe-2d44-4b12-a6e1-5accd4478d3e', '2026-03-03 06:41:28', '2026-03-03 06:41:28', NULL),
	('0e1b46db-1769-11f1-8561-24b2b9797bc8', 'RME-BBKK497402', 'Alkohol 70% 5 L', NULL, 'f0019abe-2d44-4b12-a6e1-5accd4478d3e', '2026-03-04 01:25:40', '2026-03-04 01:25:40', NULL),
	('0e1c0a71-1769-11f1-8561-24b2b9797bc8', 'RME-BBKK497402', 'Apron Plastik', NULL, 'f0019abe-2d44-4b12-a6e1-5accd4478d3e', '2026-03-04 01:25:40', '2026-03-04 01:25:40', NULL),
	('160bcf42-1747-11f1-8561-24b2b9797bc8', 'RME-BBKK441339', 'Alkohol Swab', NULL, 'f0019abe-2d44-4b12-a6e1-5accd4478d3e', '2026-03-03 21:22:30', '2026-03-03 21:22:30', NULL),
	('5a3663d9-16bf-11f1-a6fa-24b2b9797bc8', 'RME-BBKK288894', 'Apron Plastik', NULL, 'f0019abe-2d44-4b12-a6e1-5accd4478d3e', '2026-03-03 05:10:53', '2026-03-03 05:10:53', NULL),
	('71f2e955-1766-11f1-8561-24b2b9797bc8', 'RME-BBKK411035', 'Apron Plastik', NULL, 'f0019abe-2d44-4b12-a6e1-5accd4478d3e', '2026-03-04 01:06:59', '2026-03-04 01:06:59', NULL),
	('8fe6c0bc-16bd-11f1-a6fa-24b2b9797bc8', 'RME-BBKK605247', 'Abocath No 20', NULL, 'f0019abe-2d44-4b12-a6e1-5accd4478d3e', '2026-03-03 04:58:04', '2026-03-03 04:58:04', NULL),
	('a8e67e7a-1743-11f1-8561-24b2b9797bc8', 'RME-BBKK421472', 'Alkohol Swab', NULL, 'f0019abe-2d44-4b12-a6e1-5accd4478d3e', '2026-03-03 20:57:58', '2026-03-03 20:57:58', NULL);

-- Dumping structure for table sso.login_attempts
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `attempts` int DEFAULT '1',
  `blocked_until` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table sso.login_attempts: ~13 rows (approximately)
INSERT INTO `login_attempts` (`id`, `email`, `ip`, `attempts`, `blocked_until`) VALUES
	(20, 'erwin.kilback@bdcimail.com', '218.208.89.83, 218.208.89.83', 1, '2026-01-31 06:44:49'),
	(24, 'avisavisenna@a.com', '61.8.71.130, 61.8.71.130', 2, '2026-02-06 12:59:46'),
	(26, 'kakaka@mmm.com', '61.8.71.130, 61.8.71.130', 1, '2026-02-05 09:11:06'),
	(27, 'kaka@m.com', '61.8.71.130, 61.8.71.130', 2, '2026-02-05 09:59:53'),
	(28, 'kakak@m.com', '61.8.71.130, 61.8.71.130', 1, '2026-02-05 09:39:54'),
	(29, 'kakakaak@m.com', '61.8.71.130, 61.8.71.130', 1, '2026-02-05 09:40:56'),
	(30, 'kakaka@m.com', '61.8.71.130, 61.8.71.130', 1, '2026-02-05 09:41:24'),
	(31, 'kakka@m.com', '61.8.71.130, 61.8.71.130', 1, '2026-02-05 11:19:13'),
	(33, '', 'unknown', 1, '2026-03-11 11:20:52'),
	(34, 'emyu@m.com', 'unknown', 3, '2026-03-16 07:49:57'),
	(35, 'wowo@m.com', 'unknown', 1, '2026-03-16 07:43:41'),
	(36, 'wkadlk@m.com', 'unknown', 1, '2026-03-16 07:57:00'),
	(37, 'kakaka@m.com', 'unknown', 1, '2026-03-16 07:58:02');

-- Dumping structure for table sso.perawat
CREATE TABLE IF NOT EXISTS `perawat` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_perawat` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nip_perawat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table sso.perawat: ~31 rows (approximately)
INSERT INTO `perawat` (`id`, `nama_perawat`, `nip_perawat`, `created_at`, `updated_at`, `deleted_at`) VALUES
	('427200c5-70ff-11f1-acc9-bc24116dc1cc', 'Ade Fidia Daulay', '199101292025212054', '2026-06-26 01:35:05', '2026-06-26 01:35:05', NULL),
	('42720856-70ff-11f1-acc9-bc24116dc1cc', 'Alex Afandi', '199208112014021000', '2026-06-26 01:35:05', '2026-06-26 01:35:05', NULL),
	('42720c5a-70ff-11f1-acc9-bc24116dc1cc', 'Ani Suryani', '198110052008012000', '2026-06-26 01:35:05', '2026-06-26 01:35:05', NULL),
	('42721038-70ff-11f1-acc9-bc24116dc1cc', 'Astuti Nurul Taqwaty', '198405052015032000', '2026-06-26 01:35:05', '2026-06-26 01:35:05', NULL),
	('427210c9-70ff-11f1-acc9-bc24116dc1cc', 'Bakti Nugroho Setiawan', '198003042025211000', '2026-06-26 01:35:05', '2026-06-26 01:35:05', NULL),
	('4272113d-70ff-11f1-acc9-bc24116dc1cc', 'Dessy Oktavia', '198710192025212000', '2026-06-26 01:35:05', '2026-06-26 01:35:05', NULL),
	('427211ab-70ff-11f1-acc9-bc24116dc1cc', 'Dica Vinata', '198501082010122000', '2026-06-26 01:35:05', '2026-06-26 01:35:05', NULL),
	('c55a8995-70ff-11f1-acc9-bc24116dc1cc', 'Ernawati', '198201122025212029', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a906e-70ff-11f1-acc9-bc24116dc1cc', 'Evi Yuriska Tambunan', '198906102025212043', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9360-70ff-11f1-acc9-bc24116dc1cc', 'Febrian Yudistira', '199202292014021000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a946d-70ff-11f1-acc9-bc24116dc1cc', 'Hardiko Novtana', '198011182010121000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a94de-70ff-11f1-acc9-bc24116dc1cc', 'Hidayatul Faridho', '198308012010122000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a955e-70ff-11f1-acc9-bc24116dc1cc', 'Ilah Kholilah', '199906072022032000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a95c7-70ff-11f1-acc9-bc24116dc1cc', 'Iswahyuni', '198801102010122000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9631-70ff-11f1-acc9-bc24116dc1cc', 'Jaenudin', '197906282023211000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9698-70ff-11f1-acc9-bc24116dc1cc', 'Jumalikhah', '198605022014022000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9701-70ff-11f1-acc9-bc24116dc1cc', 'Junia Arum', '199706112023032000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9765-70ff-11f1-acc9-bc24116dc1cc', 'Kesia Firna Batubuaya', '199708282022032000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a97ca-70ff-11f1-acc9-bc24116dc1cc', 'Krisna Anisa', '199512022020122000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a982b-70ff-11f1-acc9-bc24116dc1cc', 'Mahriani', '198901042025212045', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9891-70ff-11f1-acc9-bc24116dc1cc', 'Ni Made Sri Wahyuni', '199505192025062000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a98fa-70ff-11f1-acc9-bc24116dc1cc', 'Nikewati Fransisca', '198704262015032000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a995c-70ff-11f1-acc9-bc24116dc1cc', 'Nurhamida, SKM', '197904052010122000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a99bb-70ff-11f1-acc9-bc24116dc1cc', 'Panji Wijaya', '198509272008011000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9a1f-70ff-11f1-acc9-bc24116dc1cc', 'Rafi Mardiana', '199005092022031000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9a81-70ff-11f1-acc9-bc24116dc1cc', 'Rispetojo Pakpahan', '197102181994032000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9ae7-70ff-11f1-acc9-bc24116dc1cc', 'Romanti Eser Tanjung', '198506282009121000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9b49-70ff-11f1-acc9-bc24116dc1cc', 'Supardi', '197106042001121000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9bae-70ff-11f1-acc9-bc24116dc1cc', 'Wahyu Frida Febyatama', '199002242015031000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9c0d-70ff-11f1-acc9-bc24116dc1cc', 'Yohana Christi', '199801052022032000', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL),
	('c55a9c6a-70ff-11f1-acc9-bc24116dc1cc', 'Yuyun Ariyani', '199209152015032001', '2026-06-26 01:38:45', '2026-06-26 01:38:45', NULL);

-- Dumping structure for table sso.refresh_tokens
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(36) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `revoked` tinyint(1) DEFAULT '0',
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=322 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table sso.refresh_tokens: ~9 rows (approximately)
INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `revoked`, `expires_at`, `created_at`) VALUES
	(238, '649c6038-f713-4182-b189-09288408b071', 'b98b066d-2073-47ab-b4e4-f6bbe0c42ae4', 1, '2026-03-06 14:43:19', '2026-02-04 14:43:19'),
	(246, '11029af9-6aed-4c5b-bebc-ea98e9a9aa22', '9d7602af-7643-4547-b268-574737b37012', 0, '2026-03-08 13:49:31', '2026-02-06 13:49:30'),
	(278, '98d8c9c1-c5c3-4370-b384-69c214dcf779', '685c13e0-7a08-4d7c-bed3-a8495e110228', 1, '2026-04-11 12:06:48', '2026-03-12 12:06:47'),
	(280, '6c610f75-cd7f-41eb-9077-d9cc102b764a', 'ce35f963-96b2-4240-8e3e-e08de0fe9e41', 1, '2026-04-11 13:20:13', '2026-03-12 13:20:12'),
	(308, '1099c485-91ca-4ee3-85b5-8c6d7eeace88', '18a58f76-c0d2-467a-af18-2eeb114625d6', 1, '2026-04-11 20:57:09', '2026-03-12 20:57:09'),
	(309, 'f11264fe-ab03-4874-8208-c4eb9d78a3b5', '84261060-0bf2-40fa-a8e0-2c2a62efcc9b', 1, '2026-04-11 22:08:37', '2026-03-12 22:08:36'),
	(317, 'bf33144c-e25c-418f-b1d6-f43fcd47350d', 'ddabbaf3-8818-4d88-80e6-82c34f65e82f', 0, '2026-04-15 09:26:33', '2026-03-16 09:26:32'),
	(318, '1ee9c737-edbf-4c63-a15b-93bfc943bbbb', '5ea36caf-8888-4899-b364-c2088b3a6ea1', 0, '2026-04-22 23:26:32', '2026-03-23 23:26:31'),
	(321, 'feb8aac0-7aa6-491d-8d56-8f9f3c3bbf96', 'd0d44f95-ff27-4cb0-96da-e44a4b579b38', 0, '2026-04-23 13:39:30', '2026-03-24 13:39:30');

-- Dumping structure for table sso.suspicious_logins
CREATE TABLE IF NOT EXISTS `suspicious_logins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(36) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `country` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=322 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table sso.suspicious_logins: ~0 rows (approximately)

-- Dumping structure for table sso.tenaga_kesehatan
CREATE TABLE IF NOT EXISTS `tenaga_kesehatan` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT (uuid()),
  `id_tenagaKesehatan` char(36) NOT NULL COMMENT 'FK to SSO user.id',
  `nama_tenagaKesehatan` varchar(150) NOT NULL,
  `terminal_tenagaKesehatan` varchar(100) DEFAULT NULL COMMENT 'Terminal asal (saat register)',
  `lokasi_tenagaKesehatan` varchar(100) DEFAULT NULL COMMENT 'Terminal bertugas saat ini (bisa pindah)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tenagaKesehatan` (`id_tenagaKesehatan`),
  CONSTRAINT `tenaga_kesehatan_ibfk_1` FOREIGN KEY (`id_tenagaKesehatan`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tabel perawat yang terdaftar di SSO, dengan relasi ke tabel users untuk informasi login dan autentikasi';

-- Dumping data for table sso.tenaga_kesehatan: ~0 rows (approximately)

-- Dumping structure for table sso.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` char(36) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `current_access` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `idx_user_email` (`email`),
  KEY `fk_user_current_access` (`current_access`),
  CONSTRAINT `fk_user_current_access` FOREIGN KEY (`current_access`) REFERENCES `user_access` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table sso.user: ~12 rows (approximately)
INSERT INTO `user` (`id`, `name`, `email`, `password`, `current_access`, `created_at`, `updated_at`, `deleted_at`) VALUES
	
	('1ee9c737-edbf-4c63-a15b-93bfc943bbbb', 'kakaka@m.com', 'kakakak@m.com', '$2b$10$ru98uFJePu0/YhLnMzXJLO4OOZlNDh4g.HnVWZD9nNqB6L8/Qg3k.', 'f2ed13c5-26d4-11f1-bc93-24b2b9797bc8', '2026-05-22 08:21:01', '2026-05-22 08:21:01', NULL),
	
	('9af649bd-19cb-4896-85ee-4866441f6b0e', 'ka@m.com', 'ka@m.com', '$2b$10$89DbJi2RMfKWxbNR6EeXB.quB4j0v7fH/c/LfAMWd3VdcL8.rgLiu', '3b5cbca4-298e-4273-be3b-3676cc8212a3', '2026-05-22 06:22:56', '2026-05-22 06:22:56', NULL),
    ('9af649bd-19cb-4896-85ee-4866aab0e', 'igd@m.com', 'igd@m.com', '$2b$10$89DbJi2RMfKWxbNR6EeXB.quB4j0v7fH/c/LfAMWd3VdcL8.rgLiu', '3b5cbca4-298e-4273-be3b-3676cc8212a3', '2026-05-22 06:22:56', '2026-05-22 06:22:56', NULL),
	

-- Dumping structure for table sso.user_access
CREATE TABLE IF NOT EXISTS `user_access` (
  `id` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL COMMENT 'FK to user.id',
  `role` varchar(100) NOT NULL COMMENT 'Sub-role, e.g. perawat, dokter, admin',
  `wilayah` varchar(100) NOT NULL COMMENT 'wilayah, e.g. terminal1a',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_role_terminal` (`user_id`,`role`,`wilayah`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table sso.user_access: ~12 rows (approximately)
INSERT INTO `user_access` (`id`, `user_id`, `role`, `wilayah`, `created_at`) VALUES
	('3b5cbca4-298e-4273-be3b-3676cc8212a3', '9af649bd-19cb-4896-85ee-4866441f6b0e', 'admin', 'terminal1a', '2026-05-22 06:22:56'),
	('3b5cbca4-298e-4273-be3b-1asdaq', '1ee9c737-edbf-4c63-a15b-93bfc943bbbb', 'pengguna', 'terminal1a', '2026-05-22 06:22:56'),
	

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
