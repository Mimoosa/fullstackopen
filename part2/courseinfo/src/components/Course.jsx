const Header2 = (props) => <h2>{props.course}</h2>;

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const Total = (props) => <p>Number of exercises {props.total}</p>;

const Course = ({ course }) => {
  const total = course.parts.reduce((acc, cur) => acc + cur.exercises, 0);

  return (
    <div>
      <Header2 course={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
    </div>
  );
};

export default Course;
