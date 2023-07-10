import ResultsSpan from './ResultsSpan.component';

const GameResults = ({ start, end }: { start: number; end: number }) => {
  if (start === 0 && end === 0) {
    return <ResultsSpan {...{ color: 'red', label: 'Wrong Key' }} />;
  }
  if (start === -1 && end === -1) {
    return <ResultsSpan {...{ color: 'red', label: 'Waiting for start' }} />;
  }
  if (end - start < 0)
    return <ResultsSpan {...{ color: 'red', label: 'Too Late' }} />;
  return (
    <ResultsSpan
      {...{
        color: 'green',
        label: `You Won! 🎉, Game duration: ${end - start}ms`,
      }}
    />
  );
};

export default GameResults;
