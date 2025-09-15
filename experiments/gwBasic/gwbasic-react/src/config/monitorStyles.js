export const monitorStyles = {
  ibmGreen: {
    name: 'IBM 5151 Green',
    brand: 'IBM',
    model: '5151 Monochrome Display',
    year: '1981',
    style: {
      background: 'linear-gradient(180deg, #e8e4dc 0%, #d0ccc4 45%, #b8b4ac 100%)',
      borderRadius: '12px',
      bezelColor: '#1a1a1a',
      screenColor: '#001100',
      phosphorColor: '#33ff33',
      hasRoundScreen: false,
      hasSpeaker: false,
      hasStand: true,
      hasIBMLogo: true,
      hasRidges: true,
      hasPowerLED: true,
      hasBrightnessKnob: true,
      classicIBM: true,
      description: 'Classic P39 Green Phosphor'
    }
  },
  ibmCGA: {
    name: 'IBM CGA Monitor',
    brand: 'IBM',
    model: '5153 Color Display',
    year: '1981',
    style: {
      background: 'linear-gradient(180deg, #e8e4dc 0%, #d0ccc4 45%, #b8b4ac 100%)',
      borderRadius: '12px',
      bezelColor: '#1a1a1a',
      screenColor: '#000000',
      phosphorColor: '#ffffff',
      cgaMode: true,
      cgaPalette: {
        black: '#000000',
        cyan: '#00ffff',
        magenta: '#ff00ff',
        white: '#ffffff'
      },
      hasRoundScreen: false,
      hasSpeaker: false,
      hasStand: true,
      hasIBMLogo: true,
      hasRidges: true,
      hasPowerLED: true,
      hasBrightnessKnob: true,
      classicIBM: true,
      description: '4-Color CGA Mode'
    }
  },
  commodore: {
    name: 'Commodore 1701',
    brand: 'COMMODORE',
    model: '1701 Monitor',
    year: '1982',
    style: {
      background: 'linear-gradient(180deg, #c8c0b0 0%, #a8a090 45%, #888070 100%)',
      borderRadius: '15px',
      bezelColor: '#2a2518',
      screenColor: '#001100',
      phosphorColor: '#00ff00',
      hasRoundScreen: false,
      hasSpeaker: true,
      speakerPosition: 'bottom-right',
      hasPowerButton: true,
      hasControlPanel: true,
      commodoreClassic: true,
      description: 'Composite Color Monitor'
    }
  }
};