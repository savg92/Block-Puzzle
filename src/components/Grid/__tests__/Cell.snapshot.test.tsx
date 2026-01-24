import React from 'react';
import { render } from '@testing-library/react-native';
import { Cell } from '../Cell';

describe('Cell Snapshots', () => {
  it('renders empty cell correctly', () => {
    const { toJSON } = render(<Cell color={0} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders filled cell correctly', () => {
    const { toJSON } = render(<Cell color="red" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders clearing cell correctly', () => {
    const { toJSON } = render(<Cell color="blue" isClearing={true} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
