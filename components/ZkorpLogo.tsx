import React from 'react';
import { Box } from '@gluestack-ui/themed';
import Svg, { Path } from 'react-native-svg';

interface ZkorpLogoProps {
  size?: number;
  color1?: string;
  color2?: string;
}

export default function ZkorpLogo({ 
  size = 60, 
  color1 = '#3E1E73',
  color2 = '#DD1111' 
}: ZkorpLogoProps) {
  return (
    <Box width={size} height={size}>
      <Svg 
        width={size} 
        height={size} 
        viewBox="0 0 600 600" 
        fill="none"
      >
        <Path 
          d="M362.5 139H427V170.5H458V234.5H492.5V364H458V427.5H362.5V459.5H233V427.5H170V364H139V234.5H170V139H233V204.5H203V234.5H170V364H203V396H233V427.5H362.5V396H392.5V364H427V234.5H392.5V204.5H362.5V139Z" 
          fill={color1}
        />
        <Path 
          d="M330 107H297.5V266.5H330V107Z" 
          fill={color1}
        />
        <Path 
          d="M297.5 107H266.5V300H330V266.5H297.5V107Z" 
          fill={color2}
        />
        <Path 
          d="M362 427.5H426V459.5H362V493.5H234V459.5H170V427.5H139V364L107 365V235.5H139V170.5H170V235.5H139V364H170V427.5H234V459.5H362V427.5Z" 
          fill={color2}
        />
      </Svg>
    </Box>
  );
}