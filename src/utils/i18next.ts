import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          header: 'Form Handling',
          input: {
            prefix:"Prefix",
            firstName: "First name",
            lastName: "Last name",
            fullName: "Name",
            idNumber: "Identification number",
            birthday: "Date of birth",
            nationality: "Nationality",
            gender: "Gender",
            tel: "Phone number",
            passport: "Passport number",
            expectedSalary: "Expected salary",
          },
          options: {
            prefix: {
              mr: "Mr.",
              ms: "Ms.",
              mrs: "Mrs.",
            },
            gender: {
              male: "Male",
              female: "Female",
              notSaying: "Prefer not to say",
            }
          },
          action: {
            clear:"Clear fields",
            submit:"Submit",
            edit: "Edit",
            delete: "Delete",
            select: "Select",
            selectAll: "Select all",
            deleteSelection: "Delete selection",
            actions: "Actions",        
          },
          language: {
            en: "En",
            th: "Th",
          },
        }
      },
      th: {
        translation: {
          header: 'การจัดการหน้าฟอร์ม',
          input: {
            prefix:"คำนำหน้า",
            firstName: "ชื่อจริง",
            lastName: "นามสกุล",
            fullName: "ชื่อ",
            idNumber: "เลขบัตรประชาชน",
            birthday: "วันเกิด",
            nationality: "สัญชาติ",
            gender: "เพศ",
            tel: "หมายเลขโทรศัพท์มือถือ",
            passport: "หนังสือเดินทาง",
            expectedSalary: "เงินเดือนที่คาดหวัง",
          },
          action: {
            clear:"ล้างข้อมูล",
            submit:"ส่งข้อมูล",
            edit: "แก้ไข",
            delete: "ลบ",
            select: "เลือกรายการนี้",
            selectAll: "เลือกทั้งหมด",
            deleteSelection: "ลบข้อมูล",
            actions: "จัดการ",          
          },
          language: {
            en: "อังกฤษ",
            th: "ไทย",
          },
        }
      },
    }
  });

export default i18n;