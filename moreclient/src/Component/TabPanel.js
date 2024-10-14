import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios'; // Axios 임포트



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  
  // 기본 탭 설정
  const [tabs, setTabs] = React.useState([
    { label: '기본 탭', content: '이것은 기본 탭의 내용입니다.' }
  ]);


  const [newTabLabel, setNewTabLabel] = React.useState('');
  const [newTabContent, setNewTabContent] = React.useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddTab = async () => {
    if (newTabLabel && newTabContent) {
      const newTab = { label: newTabLabel, content: newTabContent };
      setTabs([...tabs, newTab]);
      setNewTabLabel('');
      setNewTabContent('');
      setValue(tabs.length);

      // 서버에 폴더 생성 요청 보내기
      try {
        await axios.post('http://localhost:5000/createfolder', {
          folderName: newTabLabel, // 폴더명으로 탭의 라벨 사용
        });
        console.log('폴더 생성 성공');
      } catch (error) {
        console.error('폴더 생성 실패:', error);
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 300 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', width: '200px' }} // 고정된 너비 추가
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} {...a11yProps(index)} />
        ))}
      </Tabs>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', margin: '15px'}}>
        <TextField
          label="Tab Title"
          value={newTabLabel}
          onChange={(e) => setNewTabLabel(e.target.value)}
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="Tab Content"
          value={newTabContent}
          onChange={(e) => setNewTabContent(e.target.value)}
          sx={{ marginBottom: 1 }}
        />
        <Button variant="contained" onClick={handleAddTab}>
          Add Tab
        </Button>

        {tabs.map((tab, index) => (
          <TabPanel key={index} value={value} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
}
