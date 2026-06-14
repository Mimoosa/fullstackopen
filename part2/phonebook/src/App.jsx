import { useState, useEffect } from "react";
import phoneBookService from "./services/persons";

const Persons = ({ filteredPersons, persons, deletePerson }) => {
  return (
    <>
      {filteredPersons.map((person) => (
        <Person
          key={person.name}
          name={person.name}
          number={person.number}
          deletePerson={() => deletePerson(person.id, person.name)}
        />
      ))}
    </>
  );
};

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Person = ({ name, number, deletePerson }) => {
  return (
    <p>
      {name} {number} <Button onClick={deletePerson} text="delete" />
    </p>
  );
};

const Filter = ({ value = { value }, onChange = { onChange } }) => {
  return (
    <div>
      filter shown with
      <input value={value} onChange={onChange} />
    </div>
  );
};

const Input = ({ title, value, onChange }) => {
  return (
    <div>
      {title}: <input value={value} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <Input title="name" value={newName} onChange={handleNameChange} />
      <Input title="number" value={newNumber} onChange={handleNumberChange} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    phoneBookService
      .getAll()
      .then((initialPhoneBook) => {
        setPersons(initialPhoneBook);
      })
      .catch((error) => {
        alert("Failed to get data");
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    if (persons.filter((person) => person.name === newName).length > 0) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const id = persons.find((person) => person.name === newName).id;
        phoneBookService
          .update(id, personObject)
          .then(() => {
            setPersons(
              persons.map((person) =>
                person.name === newName
                  ? { ...person, number: newNumber }
                  : person,
              ),
            );
          })
          .catch((error) => {
            alert(`Failed to update ${newName}`);
          });
      }
    } else {
      phoneBookService
        .create(personObject)
        .then((returnedPhoneBook) => {
          setPersons(persons.concat(returnedPhoneBook));
        })
        .catch((error) => {
          alert(`Failed to add ${newName}`);
        });
    }
    setNewName("");
    setNewNumber("");
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      phoneBookService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id != id));
        })
        .catch((error) => {
          alert(`Failed to delete ${name}`);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
        filteredPersons={filteredPersons}
        persons={persons}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
