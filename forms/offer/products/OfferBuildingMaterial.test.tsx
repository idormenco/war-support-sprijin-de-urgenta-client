import React from 'react';
import { render } from '@testing-library/react';
import { OfferTents } from 'forms';

test('renders a message', () => {
  const { container, getByText } = render(<OfferTents category={0} onSubmit={function (values) {
  } } />);


  expect(getByText('Hello World')).toBeInTheDocument();
  expect(container.firstChild).toMatchInlineSnapshot(`
    <p>
      Hello World
    </p>
  `);
});