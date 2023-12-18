import React,{createContext, useContext} from 'react';
import { HashRouter, BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import classes from './App.module.css';
import './i18n';
import { ThemeProvider } from '@mui/material';
import Meeting from './components/meeting/meeting.component';
import Recorder from './components/recorder/recorder.component';
import { AppContext, DefaultContext,AppProvider } from './context/default.context';
import { Theme } from './theme/theme';
import Header from './components/header/header.component';

function App() {
  const {state , dispatch} = useContext(AppContext)
  console.log("APP COMP INITIAL STATE -> ", state)
  return (
    <AppProvider>
      <ThemeProvider theme={Theme}>
        <HashRouter>
         <Header />
          <Routes>
            <Route path="/" element={<Navigate to="meeting" replace/>} />
            <Route path="recorder" element={<Recorder/>} />
            <Route path="meeting" element={<Meeting/>} />
          </Routes>
      </HashRouter>
    </ThemeProvider>
  </AppProvider>
  );
}

export default App;
