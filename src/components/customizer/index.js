import React, { useState } from 'react';

const Customizer = () => {
  const [refresh, setRefresh] = useState(false);

  const primaryColorAlready= localStorage.getItem('primary-color');
  var defaultColor= '#159aff';
  if(primaryColorAlready != null){
    var defaultColor = primaryColorAlready;
  }
  const fmAlready= localStorage.getItem('font-family');
  var defaultfm= "Helvetica, Arial, sans-serif";
  if(fmAlready != null){
    var defaultfm = fmAlready;
  }

  const fzAlready= localStorage.getItem('font-label');
  var defaultfz= '14px';
  if(fzAlready != null){
    var defaultfz = fzAlready;
  }

  const tcAlready= localStorage.getItem('text-color');
  var defaulttc= '#000000';
  if(tcAlready != null){
    var defaulttc = tcAlready;
  }

  const tfcAlready= localStorage.getItem('text-field-color');
  var defaulttfc= '#000000';
  if(tfcAlready != null){
    var defaulttfc = tfcAlready;
  }

  const fbgAlready= localStorage.getItem('form-bg-color');
  var defaultfbg= '#fffbfb';
  if(fbgAlready != null){
    var defaultfbg = fbgAlready;
  }

  const bt1Already= localStorage.getItem('btn-bg');
  var defaultbt1= '#159aff';
  if(bt1Already != null){
    var defaultbt1 = bt1Already;
  }
  const bt2Already= localStorage.getItem('btn-border-bg');
  var defaultbt2= '#159aff';
  if(bt2Already != null){
    var defaultbt2 = bt2Already;
  }

  const bt3Already= localStorage.getItem('btn-text-color');
  var defaultbt3= 'white';
  if(bt3Already != null){
    var defaultbt3 = bt3Already;
  }
  // console.log(defaultColor)
  
  
  const [primaryColor, setPrimaryColor] = useState(defaultColor); 
  const [fontSize, setFontSize] = useState(fzAlready); 
  const [fontFamily, setFontFamily] = useState(defaultfm); 
  const [textColor, setTextColor] = useState(defaulttc); 
  const [textFieldColor, setTextFieldColor] = useState(defaulttfc); 
  const [formBgColor, setFormBgColor] = useState(defaultfbg); 
  const [buttonBgColor, setButtonBgColor] = useState(defaultbt1); 
  const [buttonBbgColor, setButtonBbgColor] = useState(defaultbt2); 
  const [buttontcColor, setButtontcColor] = useState(defaultbt3); 

  const handleSavePreferences = () => {
    alert('Updated !')
    const cssSettings = `
      :root {
        --primary-color: ${primaryColor};
        --font-size: ${fontSize};
        --font-family: ${fontFamily};
        --text-color: ${textColor};
        --text-field-color: ${textFieldColor};
        --form-bg-color: ${formBgColor};
        --btn-bg: ${buttonBgColor};
        --btn-border-bg: ${buttonBbgColor};
        --btn-text-color: ${buttontcColor};
      }
    `;
    const currentTheme= localStorage.getItem('themeMode');

    if(currentTheme != null)
    {
      if(currentTheme == 'light'){
        localStorage.setItem('primary-color', primaryColor); 
        localStorage.setItem('font-label', fontSize); 
        localStorage.setItem('font-family', fontFamily); 
        localStorage.setItem('text-color', textColor); 
        localStorage.setItem('text-field-color', textFieldColor); 
        localStorage.setItem('form-bg-color', formBgColor); 
        localStorage.setItem('btn-bg', buttonBgColor); 
        localStorage.setItem('btn-border-bg', buttonBbgColor); 
        localStorage.setItem('btn-text-color', buttontcColor); 
      }else{
        localStorage.setItem('dark_primary-color', primaryColor); 
        localStorage.setItem('dark_font-label', fontSize); 
        localStorage.setItem('font-family', fontFamily); 
        localStorage.setItem('text-color', textColor); 
        localStorage.setItem('text-field-color', textFieldColor); 
        localStorage.setItem('form-bg-color', formBgColor); 
        localStorage.setItem('btn-bg', buttonBgColor); 
        localStorage.setItem('btn-border-bg', buttonBbgColor); 
        localStorage.setItem('btn-text-color', buttontcColor); 

      }
    }else{
      localStorage.setItem('primary-color', primaryColor); 
      localStorage.setItem('font-label', fontSize); 
      localStorage.setItem('font-family', fontFamily); 
      localStorage.setItem('text-color', textColor); 
      localStorage.setItem('text-field-color', textFieldColor); 
      localStorage.setItem('form-bg-color', formBgColor); 
      localStorage.setItem('btn-bg', buttonBgColor); 
      localStorage.setItem('btn-border-bg', buttonBbgColor); 
      localStorage.setItem('btn-text-color', buttontcColor); 

    }
    localStorage.setItem('userStyles', cssSettings); 
    applyStyles(cssSettings); 
  };

  


  const applyStyles = (css) => {
    const styleSheet = document.getElementById('dynamic-styles');

    if (styleSheet) {
      styleSheet.innerHTML = css; 
    } else {
      const style = document.createElement('style');
      style.id = 'dynamic-styles';
      style.innerHTML = css;
      document.head.appendChild(style); 
    }
  };

  const [formData, setFormData] = useState({
    field1: '#159aff',
    field2: '14px',
    field3: "Helvetica, Arial, sans-serif",
    field4: '#000000',
    field5: '#000000',
    field6: '#fffbfb',
    field7: '#159aff',
    field8: '#159aff',
    field9: '#ffffff',

  });

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('primary-color', formData.field1); 
    localStorage.setItem('font-label', formData.field2); 
    localStorage.setItem('font-family', formData.field3); 
    localStorage.setItem('text-color', formData.field4); 
    localStorage.setItem('text-field-color', formData.field5); 
    localStorage.setItem('form-bg-color', formData.field6); 
    localStorage.setItem('btn-bg', formData.field7); 
    localStorage.setItem('btn-border-bg', formData.field8); 
    localStorage.setItem('btn-text-color', formData.field9); 

    // handleSavePreferences();
    alert('reset success !')
    const cssSettings = `
    :root {
      --primary-color: ${formData.field1};
      --font-size: ${formData.field2};
      --font-family: ${formData.field3};
      --text-color: ${formData.field4};
      --text-field-color: ${formData.field5};
      --form-bg-color: ${formData.field6};
      --btn-bg: ${formData.field7};
      --btn-border-bg: ${formData.field8};
      --btn-text-color: ${formData.field9};
    }
  `;
    localStorage.setItem('userStyles', cssSettings); 
    applyStyles(cssSettings); 
    // setRefresh(1);
    window.location.reload();
  };

  // handleSavePreferences();
  return (
    <div style={{
      padding: '30px', 
      maxWidth: '700px', 
      margin: '20px auto', 
      background: '#fff', 
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)', 
      borderRadius: '10px'
  }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px', fontWeight: '600' }}>General Settings</h2>
      
      {/* Color Picker */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: '500', color: '#555' }}>Primary Color:</label>
          <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer' }}
          />
      </div>
  
      {/* Font Styling */}
      <h3 style={{ color: '#333', marginBottom: '10px' }}>Font Styling</h3>
  
      {/* Font Size */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: '500', color: '#555' }}>Font Size:</label>
          <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              style={{ padding: '8px', width: '220px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="28px">28px</option>
              <option value="32px">32px</option>
          </select>
      </div>
  
      {/* Font Family */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: '500', color: '#555' }}>Font Family:</label>
          <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              style={{ padding: '8px', width: '220px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="Helvetica, Arial, sans-serif">Theme Font (Helvetica)</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Lucida Sans">Lucida Sans</option>
            <option value="Garamond">Garamond</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Palatino">Palatino</option>
            <option value="Ubuntu">Ubuntu</option>
            <option value="Futura">Futura</option>
            <option value="Raleway">Raleway</option>
            <option value="Merriweather">Merriweather</option>
            <option value="Droid Sans">Droid Sans</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="PT Serif">PT Serif</option>
            <option value="Raleway">Raleway</option>
            <option value="Source Sans Pro">Source Sans Pro</option>
            <option value="Poppins">Poppins</option>
            <option value="Quicksand">Quicksand</option>
            <option value="Nunito">Nunito</option>
            <option value="Oswald">Oswald</option>
            <option value="Slabo 27px">Slabo 27px</option>
            <option value="Lora">Lora</option>
            <option value="Work Sans">Work Sans</option>
            <option value="Karla">Karla</option>
            <option value="Rubik">Rubik</option>
            <option value="Bebas Neue">Bebas Neue</option>
            <option value="Muli">Muli</option>
            <option value="Oxygen">Oxygen</option>
            <option value="Cabin">Cabin</option>
            <option value="Titillium Web">Titillium Web</option>
            <option value="Asap">Asap</option>
            <option value="Inconsolata">Inconsolata</option>
            <option value="Anton">Anton</option>
            <option value="Indie Flower">Indie Flower</option>
            <option value="Exo">Exo</option>
            <option value="Pacifico">Pacifico</option>
            <option value="Dancing Script">Dancing Script</option>
            <option value="Lobster">Lobster</option>
            <option value="Abril Fatface">Abril Fatface</option>
            <option value="Righteous">Righteous</option>
            <option value="Caveat">Caveat</option>
            <option value="Maven Pro">Maven Pro</option>
            <option value="Orbitron">Orbitron</option>
            <option value="Zilla Slab">Zilla Slab</option>
            <option value="Bitter">Bitter</option>
            <option value="Catamaran">Catamaran</option>
            <option value="Cairo">Cairo</option>
            <option value="Comfortaa">Comfortaa</option>
            <option value="Saira">Saira</option>
            <option value="Overpass">Overpass</option>
          </select>
      </div>
  
      {/* Text Color */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: '500', color: '#555' }}>Text Color:</label>
          <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer' }}
          />
      </div>
  
      {/* Text Field Color */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: '500', color: '#555' }}>Text Field Color:</label>
          <input
              type="color"
              value={textFieldColor}
              onChange={(e) => setTextFieldColor(e.target.value)}
              style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer' }}
          />
      </div>
  
      {/* Form Background */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontWeight: '500', color: '#555' }}>Form/Card Background:</label>
          <input
              type="color"
              value={formBgColor}
              onChange={(e) => setFormBgColor(e.target.value)}
              style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer' }}
          />
      </div>
  
      {/* Button Styling */}
      <h3 style={{ color: '#333', marginBottom: '10px' }}>Primary Button Styling</h3>
  
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: '500', color: '#555' }}>Button Background:</label>
              <input
                  type="color"
                  value={buttonBgColor}
                  onChange={(e) => setButtonBgColor(e.target.value)}
                  style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer' }}
              />
          </div>
  
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: '500', color: '#555' }}>Button Border:</label>
              <input
                  type="color"
                  value={buttonBbgColor}
                  onChange={(e) => setButtonBbgColor(e.target.value)}
                  style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer' }}
              />
          </div>
  
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: '500', color: '#555' }}>Button Text Color:</label>
              <input
                  type="color"
                  value={buttontcColor}
                  onChange={(e) => setButtontcColor(e.target.value)}
                  style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer' }}
              />
          </div>
      </div>
  
      <button 
          onClick={handleSavePreferences} 
          style={{
              width: '100%', 
              padding: '12px 0', 
              backgroundColor: primaryColor, 
              color: '#fff', 
              fontWeight: '600', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              marginTop: '30px'
          }}
      >
          Update Preferences
      </button>
       <form onSubmit={handleSubmit}>
        {/* 9 Hidden Fields */}
        <input type="hidden" name="field1" value={formData.field1} />
        <input type="hidden" name="field2" value={formData.field2} />
        <input type="hidden" name="field3" value={formData.field3} />
        <input type="hidden" name="field4" value={formData.field4} />
        <input type="hidden" name="field5" value={formData.field5} />
        <input type="hidden" name="field6" value={formData.field6} />
        <input type="hidden" name="field7" value={formData.field7} />
        <input type="hidden" name="field8" value={formData.field8} />
        <input type="hidden" name="field9" value={formData.field9} />
  
        {/* Submit Button */}
        <button style={{
              width: '100%', 
              padding: '12px 0', 
              backgroundColor: '#c1c1c1', 
              color: '#fff', 
              fontWeight: '600', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              marginTop: '30px'
          }}
          type="submit">Reset</button>
      </form>
  </div>
  
    
  );
};

export default Customizer;