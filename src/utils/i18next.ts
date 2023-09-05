import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { nationalitiesEn, nationalitiesTh } from './data';

const nationalitiesObjectEn: { [key: string]: string } = {};
const nationalitiesObjectTh: { [key: string]: string } = {};

nationalitiesEn.forEach((item) => {
  nationalitiesObjectEn[item] = item;
});

nationalitiesTh.forEach((itemTh) => {
  nationalitiesEn.forEach((itemEn) => {
    nationalitiesObjectTh[itemEn] = itemTh;
  });
});



for (let i = 0; i < nationalitiesTh.length; i++) {
  const key = nationalitiesEn[i];
  const value = nationalitiesTh[i];
  nationalitiesObjectTh[key] = value;
}

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
          error: 'This field is required',
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
            confirmEdit: "Confirm edit",
            cancel: "Cancel",
            actions: "Actions",        
          },
          placeholder: {
            nationality: "- - Select - -",
            birthday: "mm/dd/yyyy"
          },
          language: {
            en: "En",
            th: "Th",
          },
          nationalities: nationalitiesObjectEn,
        }
      },
      th: {
        translation: {
          header: 'การจัดการหน้าฟอร์ม',
          error: 'กรุณากรอกข้อมูลช่องนี้',
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
          options: {
            prefix: {
              mr: "นาย",
              ms: "นางสาว",
              mrs: "นาง",
            },
            gender: {
              male: "ผู้ชาย",
              female: "ผู้หญิง",
              notSaying: "ไม่ระบุ",
            }
          },
          action: {
            clear:"ล้างข้อมูล",
            submit:"ส่งข้อมูล",
            edit: "แก้ไข",
            delete: "ลบ",
            select: "เลือกรายการนี้",
            selectAll: "เลือกทั้งหมด",
            confirmEdit: "แก้ข้อมูล",
            cancel: "ยกเลิก",
            deleteSelection: "ลบข้อมูล",
            actions: "จัดการ",          
          },
          placeholder: {
            nationality: "- - กรุณาเลือก - -",
            birthday: "เดือน/วัน/ปี"
          },
          language: {
            en: "อังกฤษ",
            th: "ไทย",
          },
          nationalities: nationalitiesObjectTh,
        }
      },
    }
  });

export default i18n;