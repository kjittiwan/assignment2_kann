import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Radio, Select, DatePicker, Row, Col, Table, Pagination, Divider } from 'antd';
import { nationalities, countryCodes } from './data';
import {
  setPrefix,
  setFirstName,
  setLastName,
  setFullName,
  setBirthday,
  setNationality,
  setIdNumber,
  setGender,
  setTel,
  setPassport,
  setExpectedSalary,
} from './editSlice'
interface FormData {
  prefix: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthday: string;
  nationality: string;
  idNumber: string;
  gender: string;
  passport: string;
  expectedSalary: string;
  key: string
}
interface SavedData {
  dataCollection: FormData[];
}
const EditForm = ({ itemToEdit, setDataSource, setModalIsOpen }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.editData);
  const formatId = (id) => {
    const result = [];
    if (id.length === 13) {
      result.push(id.charAt(0));
      result.push(id.substr(1, 4));
      result.push(id.substr(5, 5));
      result.push(id.substr(10, 2));
      result.push(id.charAt(12));
    } else {
      console.error('Input string must have exactly 13 characters');
    }
    return result;
  }
  const splitTel = (tel) => {
    return tel.split(' ');
  }
  const [form] = Form.useForm();
  const [idParts, setIdParts] = useState<string[]>(itemToEdit.idNumber === "" ? ['', '', '', '', ''] :formatId(itemToEdit.idNumber) );
  const [telParts, setTelParts] = useState<string[]>(splitTel(itemToEdit.tel));
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16, },
  };


  const getDate = (date) => {
    const dateParts = date.split("/");
    return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  }
  const initialValues = {
  birthday: dayjs(itemToEdit.birthday, "MM/DD/YYYY"),
  expectedSalary: itemToEdit.expectedSalary,
  firstName: itemToEdit.firstName,
  gender: itemToEdit.gender,
  idNumber: idParts,
  lastName: itemToEdit.lastName,
  nationality: itemToEdit.nationality,
  passport: itemToEdit.passport,
  prefix: itemToEdit.prefix,
  tel: telParts,
  }
  const setInitialStates = () => {
    dispatch(setExpectedSalary(itemToEdit.expectedSalary))
    dispatch(setFirstName(itemToEdit.firstName))
    dispatch(setFullName(itemToEdit.fullName))
    dispatch(setGender(itemToEdit.gender))
    if (itemToEdit.idNumber !== "") {
      dispatch(setIdNumber(itemToEdit.idNumber))
    }
    dispatch(setLastName(itemToEdit.lastName))
    dispatch(setNationality(itemToEdit.nationality))
    dispatch(setPassport(itemToEdit.passport))
    dispatch(setPrefix(itemToEdit.prefix))
    dispatch(setTel(itemToEdit.tel))
    dispatch(setBirthday(itemToEdit.birthday))
  }
  useEffect(() => {
      setInitialStates()
  }, [])
  const handleInputChange = useCallback((name: string, value: string) => {
    switch (name) {
      case 'prefix':
        dispatch(setPrefix(value));
        break;
      case 'firstName':
        // dispatch(setFullName(`${value} ${formData.lastName}`));
        dispatch(setFirstName(value));
        
        break;
      case 'lastName':
        // dispatch(setFullName(`${formData.firstName} ${value}`));
        dispatch(setLastName(value));
        break;
      case 'birthday':
        dispatch(setBirthday(value));
        break;
      case 'nationality':
        dispatch(setNationality(value));
        break;
      case 'gender':
        dispatch(setGender(value));
        break;
      case 'tel':
        dispatch(setTel(value));
        break;
      case 'passport':
        dispatch(setPassport(value));
        break;
      case 'expectedSalary':
        dispatch(setExpectedSalary(value));
        break;
      default:
        break;
    }
  }, [dispatch]);
  const handleInputChangeId = (value: string, index: number, maxLength: number) => {
    const numericValue = value.replace(/\D/g, '');
    if (index < 4) {
      if (numericValue.length === maxLength) {
        const nextIndex = index + 1;
        if (nextIndex < idParts.length) {
          document.getElementById(`input-${nextIndex}`)?.focus();
        }
      }
    }
    const idPartsClone = [...idParts];
    idPartsClone[index] = numericValue;
    setIdParts(idPartsClone);
    const combinedParts = idPartsClone.join("")
    dispatch(setIdNumber(combinedParts));
  };
  const handleInputChangeTel = (value: string, index: number) => {
    const numericValue = value.replace(/[^\d-\s]/g, '');
    const telPartsClone = [...telParts]
    if (index === 0) {
      telPartsClone[index] = value
    } else {
      telPartsClone[index] = numericValue
    }
    setTelParts(telPartsClone)
    const combinedParts = telPartsClone.join(" ")
    dispatch(setTel(combinedParts));
  }
  console.log('item', itemToEdit)
  const updateData = (formData : FormData) => {
    console.log('form finish')
    const savedDataString = localStorage.getItem('dataCollection');
    const savedData: SavedData = savedDataString ? JSON.parse(savedDataString) : { dataCollection: [] };
    if (savedData) {
      console.log('savedData', savedData)

      const updatedData = [...savedData].map((item) => {
        console.log('itemkey',item.key)
        console.log('itemtoeditkey', itemToEdit.key)
        if (item.key === itemToEdit.key) {
          return {...formData, key: item.key}
        } else {
          return item
        }
      })
      console.log('updated', updatedData)
      localStorage.setItem('dataCollection', JSON.stringify(updatedData));
      setDataSource(updatedData)
      setModalIsOpen(false)
    }
  }

  return (
    <div className="modal">
      <Form
      form={form}
      name="edit-form"
      className="edit-form"
      initialValues={initialValues}
      onValuesChange={(changedValues, allValues) => {
        if ('firstName' in changedValues || 'lastName' in changedValues) {
          // Combine first name and last name when either of them changes
          const updatedFullName = `${allValues.firstName || ''} ${allValues.lastName || ''}`;
          dispatch(setFullName(updatedFullName));
        }
      }}
       onFinish={() => updateData(formData)}>
        <Row gutter={8}>
          <Col span={4}>
            <Form.Item  name="prefix" label="คำนำหน้า" rules={[{ required: true, message: "ได้โปรดเลือกคำนำหน้า" }]}>
              <Select
              placeholder="คำนำหน้า"
              value={formData.prefix}
              onChange={(value) => handleInputChange('prefix', value)}
              >
                <Option value="นาย">นาย</Option>
                <Option value="นาง">นาง</Option>
                <Option value="นางสาว">นางสาว</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="firstName" label="ชื่อจริง" rules={[{ required: true }]}>
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item  name="lastName" label="นามสกุล" rules={[{ required: true }]}>
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item name="birthday" label="วันเกิด" rules={[{ required: true }]}>
              <DatePicker
                format="MM/DD/YYYY"
                placeholder="เดือน/วัน/ปี"
                value={formData.birthday}
                onChange={(date, dateString) => handleInputChange('birthday', dateString)}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="nationality" label="สัญชาติ" rules={[{ required: true }]}>
              <Select
              value={formData.nationality}
              onChange={(value) => handleInputChange('nationality', value)}
              placeholder="- - กรุณาเลือก - -">
                {nationalities.map((item, index) => {
                  return <Option key={index} value={item}>{item}</Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="idNumber" label="เลขบัตรประชาชน">
          <Row>
            {idParts.map((part, index, array) => {
            const getMaxLength = (index: number): number => {
            switch (index) {
              case 0:
                return 1;
              case 1:
                return 4;
              case 2:
                return 5;
              case 3:
                return 2;
              case 4:
                return 1;
              default:
                return 3;
            }
            };
              const maxLength = getMaxLength(index);
              return (
                <Col
                className="id-input" 
                span={index === 0
                  ? 3
                  : index === 1
                  ? 5
                  : index === 2
                  ? 5
                  : index === 3
                  ? 4
                  : 3
                }
                >
                  <Input
                    key={index}
                    id={`input-${index}`}
                    value={part}
                    onChange={(e) => handleInputChangeId(e.target.value, index, maxLength)}
                    maxLength={maxLength}
                  />
                    <span className={`dash
                    ${index === array.length - 1 ? "hidden" : ""}`}>
                      -
                    </span>
                </Col>
              );
            })}
          </Row>
        </Form.Item>
        <Row>
          <Col>
            <Form.Item name="gender" label="เพศ" rules={[{ required: true }]}>
              <Radio.Group
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <Radio value={'ผู้ชาย'}>ผู้ชาย</Radio>
                <Radio value={'ผู้หญิง'}>ผู้หญิง</Radio>
                <Radio value={'ไม่ระบุ'}>ไม่ระบุ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="tel" label="หมายเลขโทรศัพท์มือถือ" rules={[{ required: true }]}>
          <Row>
            <Col span={4} className="id-input">
              <Select
                value={telParts[0]}
                onChange={(value) => handleInputChangeTel(value, 0)}
              >
                  {countryCodes.map((item, index) => {
                    return <Option key={index} value={item}>{item}</Option>;
                  })}
              </Select>
              <span className="dash">-</span>
            </Col>
            <Col span={8}>
              <Input
                value={telParts[1]}
                onChange={(e) => handleInputChangeTel(e.target.value, 1)}
              />
            </Col>
          </Row>
        </Form.Item>
        <Row>
          <Col span={10}>
            <Form.Item name="passport" label="หนังสือเดินทาง">
              <Input
                value={formData.passport}
                onChange={(e) => handleInputChange('passport', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item
              name="expectedSalary"
              label="เงินเดือนที่คาดหวัง"
              rules={[{ required: true }]}
            >
              <Input
                value={formData.expectedSalary}
                onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={14}>
        <Form.Item {...tailLayout}>
          <Button htmlType="submit" className="send-button">
            แก้ข้อมูล
          </Button>
          <Button htmlType="button" onClick={() => setModalIsOpen(false)}>
            ยกเลิก
          </Button>
        </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>

  );
};

export default EditForm;
