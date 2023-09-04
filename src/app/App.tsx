import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Radio, Select, DatePicker, Row, Col, Table, Checkbox, Divider } from 'antd';
import '../styles/App.scss';
import { nationalities, countryCodes } from '../data';
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
} from '../redux/formSlice';
import EditForm from './EditForm';

type FormData = {
  prefix: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthday: string;
  tel: string;
  nationality: string;
  idNumber: string;
  gender: string;
  passport: string;
  expectedSalary: string;
  key: string;
}
type SavedData = {
  dataCollection: FormData[];
}

const App: React.FC = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.formData);
  const [form] = Form.useForm();
  const [idParts, setIdParts] = useState<string[]>(['', '', '', '', '']);
  const [telParts, setTelParts] = useState<string[]>(['', '']);
  const [dataSource, setDataSource] = useState<FormData[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  console.log(formData);

  const onReset = () => {
    form.resetFields();
    setIdParts(['', '', '', '', '']);
    setTelParts(['', '']);
  };

  const handleInputChange = useCallback((name: string, value: string) => {
    switch (name) {
      case 'prefix':
        dispatch(setPrefix(value));
        break;
      case 'firstName':
        dispatch(setFirstName(value));
        break;
      case 'lastName':
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
    const combinedParts = idPartsClone.join("");
    dispatch(setIdNumber(combinedParts));
  };
  const handleInputChangeTel = (value: string, index: number) => {
    const numericValue = value.replace(/[^\d-\s]/g, '');
    const telPartsClone = [...telParts];
    if (index === 0) {
      telPartsClone[index] = value;
    } else {
      telPartsClone[index] = numericValue;
    }
    setTelParts(telPartsClone);
    const combinedParts = telPartsClone.join(" ");
    dispatch(setTel(combinedParts));
  }

const columns = [
  {
    title: 'ชื่อ',
    dataIndex: 'fullName',
    key: 'fullName',
    sorter: (a: FormData, b: FormData) => a.fullName.localeCompare(b.fullName),
  },
  {
    title: 'เพศ',
    dataIndex: 'gender',
    key: 'gender',
    sorter: (a: FormData, b: FormData) => a.gender.localeCompare(b.gender),
  },
  {
    title: 'หมายเลขโทรศัพท์มือถือ',
    dataIndex: 'tel',
    key: 'tel',
    sorter: (a: FormData, b: FormData) => {
      const telA = a.tel.replace(/[^\d]/g, '');
      const telB = b.tel.replace(/[^\d]/g, '');
      return parseInt(telA) - parseInt(telB)
    },
  },
  {
    title: 'สัญชาติ',
    dataIndex: 'nationality',
    key: 'nationality',
    sorter: (a: FormData, b: FormData) => a.nationality.localeCompare(b.nationality),
  },
  {
    title: 'จัดการ',
    dataIndex: 'action',
    key: 'action',
    render: (text: string, record: FormData) => (
      <span>
        <Button  onClick={() => handleEdit(record)}>แก้ไข</Button>
        <Divider type="vertical" />
        <Button  onClick={() => handleDelete(record.key)}>ลบ</Button>
        <Divider type="vertical" />
        <Checkbox checked={selectedItems.includes(record.key)} onChange={() => handleSelectItem(record.key)}>
          เลือกรายการนี้
        </Checkbox>
      </span>
    ),
  },
];

const handleEdit = (record: FormData) => {
  setModalIsOpen(true);
  setItemToEdit(record);
};

const handleDelete = (key: string) => {
  const updatedData = dataSource.filter((item) => {return item.key !== key});
    localStorage.setItem('dataCollection', JSON.stringify(updatedData));
    setDataSource(updatedData);
};

const handleSelectItem = (key: any) => {
  if (!selectedItems.includes(key)) {
    setSelectedItems((prev) => {
      return [...prev, key]
    })
  } else {
    const newSelectedItems = selectedItems.filter((item) => item !== key);
    setSelectedItems(newSelectedItems);
  }
};

const handleSelectAllItems = () => {
  if (!isSelectAll) {
    dataSource.map((item) => {
      setSelectedItems((prev) => {
        return [...prev, item.key];
      })
    })
    setIsSelectAll(true);
  } else {
    setSelectedItems([]);
    setIsSelectAll(false);
  }
};

useEffect(() => {
  const savedData = localStorage.getItem('dataCollection');
  if (savedData && savedData.length !== 0) {
    const parsedData = JSON.parse(savedData);
    const dataSource = parsedData.map((item: FormData, index: number) => ({ ...item, key: index }));
    setDataSource(dataSource);
  } else {
    localStorage.setItem('dataCollection', JSON.stringify([]));
  }
}, []);
const saveFormDataToLocalStorage = (formData : FormData) => {
  const savedDataString = localStorage.getItem('dataCollection');
  const savedData: SavedData = savedDataString ? JSON.parse(savedDataString) : [];
  if (savedData) {
    const updatedData = [...savedData, formData];
    const updatedDataWithKey = updatedData.map((item, index) => ({ ...item, key: index }));
    localStorage.setItem('dataCollection', JSON.stringify(updatedDataWithKey));
    setDataSource(updatedDataWithKey);
    onReset();
  }
};

const removeSelectedDataFromLocalStorage = (selectedItems: string[]) => {
  const savedDataString = localStorage.getItem('dataCollection');
  const savedData = savedDataString ? JSON.parse(savedDataString) : [];
  if (savedData) {
    const updatedData = [...savedData].filter((item) => {
      return !selectedItems.includes(item.key);
    });
    localStorage.setItem('dataCollection', JSON.stringify(updatedData));
    setSelectedItems([]);
    setDataSource(updatedData);
  }
};
  return (
    <section>
      <header>
        <h1>การจัดการหน้าฟอร์ม</h1>
      </header>
      <Form
      form={form}
      name="main-form"
      onValuesChange={(changedValues, allValues) => {
        if ('firstName' in changedValues || 'lastName' in changedValues) {
          const updatedFullName = `${allValues.firstName || ''} ${allValues.lastName || ''}`;
          dispatch(setFullName(updatedFullName));
        }
      }}
       onFinish={() => saveFormDataToLocalStorage(formData)}>
        <Row gutter={8}>
          <Col span={4}>
            <Form.Item  name="prefix" label="คำนำหน้า" rules={[{ required: true, message: "ได้โปรดเลือกคำนำหน้า" }]}>
              <Select
              placeholder="คำนำหน้า"
              value={formData.prefix}
              onChange={(value) => handleInputChange('prefix', value)}
              >
                <Select.Option value="นาย">นาย</Select.Option>
                <Select.Option value="นาง">นาง</Select.Option>
                <Select.Option value="นางสาว">นางสาว</Select.Option>
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
                  return <Select.Option key={index} value={item}>{item}</Select.Option>;
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
                    return <Select.Option key={index} value={item}>{item}</Select.Option>;
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
        <Form.Item wrapperCol={{ offset: 8, span: 16}}>
          <Button htmlType="submit" className="send-button">
            ส่งข้อมูล
          </Button>
          <Button htmlType="button" onClick={onReset}>
            ล้างข้อมูล
          </Button>
        </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="table-container">
        <div className="delete-container">
          <Checkbox checked={isSelectAll} onChange={handleSelectAllItems}>
            เลือกทั้งหมด
          </Checkbox>
          <Button onClick={() => removeSelectedDataFromLocalStorage(selectedItems)}>
            ลบข้อมูล
          </Button>
        </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10 }}
        onChange={(pagination, filters, sorter) => {
          console.log('Pagination:', pagination);
          console.log('Filters:', filters);
          console.log('Sorter:', sorter);
        }}
      />

    </div>
    {modalIsOpen && (
      <EditForm itemToEdit={itemToEdit as FormData} setDataSource={setDataSource} setModalIsOpen={setModalIsOpen}/>
    )}
    </section>
  );
};
export default App;