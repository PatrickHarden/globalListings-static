import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uiSelector, toggleThemeMode } from 'state/ui';
//
import { SwitchThemeModeButton } from './styles';


const SwitchThemeMode: React.FC = () => {
  const { themeMode } = useSelector(uiSelector);
  const dispatch = useDispatch();

  return (
    <SwitchThemeModeButton onClick={() => dispatch(toggleThemeMode())}>
      {themeMode === 'light' ? <span>light</span>: <span>dark</span>}
    </SwitchThemeModeButton>
  );
};


export default SwitchThemeMode;
