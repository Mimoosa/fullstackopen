import { useGood, useNeutral, useBad } from "../store";

const Statistics = () => {
  const good = useGood();
  const neutral = useNeutral();
  const bad = useBad();
  const all = good + neutral + bad;
  const average = (good * 1 + neutral * 0 + bad * -1) / (good + neutral + bad);
  const positive = (good / (good + neutral + bad)) * 100;

  if (good == 0 && neutral == 0 && bad == 0) {
    return <p>No feedback given</p>;
  }
  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr>
            <td>good</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>neutral</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>bad</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td>all</td>
            <td>{all}</td>
          </tr>
          <tr>
            <td>average</td>
            <td>{average}</td>
          </tr>
          <tr>
            <td>positive</td>
            <td>{positive}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
