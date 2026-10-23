import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('SignalBoard dashboard', () => {
  it('renders the overview and simulated-data notice', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /good evening/i })).toBeInTheDocument();
    expect(screen.getByText(/metrics and events are simulated locally/i)).toBeInTheDocument();
  });

  it('searches events and shows an empty state for no matches', async () => {
  const user = userEvent.setup();
  render(<App />);

  const search = screen.getAllByRole('textbox', {
    name: /search events/i,
  })[0];

  await user.type(search, 'nothing-matches-this');

  expect(
    screen.getByText(/no events found|no matching events|no results/i),
  ).toBeInTheDocument();
});

  it('filters events by severity', async () => {
  const user = userEvent.setup();
  render(<App />);

  const filters = screen.getAllByRole('combobox', {
    name: /filter by severity/i,
  });

  await user.selectOptions(filters[0], 'Critical');

  expect(
    screen.getAllByText(/payment processor timeout recovered/i).length,
  ).toBeGreaterThan(0);
});
  it('pauses the simulated stream', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole('button', { name: /pause stream/i })[0]);
    expect(screen.getByText(/demo stream is paused/i)).toBeInTheDocument();
    expect(screen.getByText(/stream paused/i)).toBeInTheDocument();
  });
});
