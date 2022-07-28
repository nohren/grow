import React from 'react';
import Confetti from 'react-confetti';
import { withSize } from 'react-sizeme';

function Congrats(props) {
  const { height, width } = props;
  return <Confetti width={width} height={height} />;
}

export default withSize({ monitorHeight: true })(Congrats);
