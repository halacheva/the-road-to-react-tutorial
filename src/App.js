import React, { Component, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";

function App() {
  const list = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0
    },
    {
      title: "Redux",
      url: "https://redux.js.org",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1
    }
  ];

  class Developer {
    constructor(firstname, lastname) {
      this.firstname = firstname;
      this.lastname = lastname;
    }

    getName() {
      return this.firstname + " " + this.lastname;
    }
  }

  const devFunction = new Developer("Mimka", "Functional Component");
  const devClass = new Developer("Mimka", "Class Component");

  // function searchFor(searchTerm) {
  //   return function(item) {
  //     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  //   };
  // }
  const searchFor = searchTerm => item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

  const Button = ({ onClick, className = "", children }) => (
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>
  );

  const Search = ({ value, onChange, children }) => (
    <div>
      <form>
        <label htmlFor="input[type=text]">{children}</label>
        <input type="text" value={value} onChange={onChange} />
      </form>
      <p> SEARCH: the current time is {new Date().toTimeString()}</p>
    </div>
  );

  const Table = ({ list, pattern, onDismiss }) => (
    <div>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Object ID</th>
            <th>Title</th>
            <th>Author</th>
            <th># Comments</th>
            <th>Points</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.filter(searchFor(pattern)).map((item, index) => (
            <tr key={item.objectID}>
              <td>{index}</td>
              <td>{item.objectID}</td>
              <td>
                <a href={item.url}>{item.title}</a>
              </td>
              <td>{item.author}</td>
              <td>{item.num_comments}</td>
              <td>{item.points}</td>
              <td>
                <Button onClick={() => onDismiss(item.objectID)}>
                  Dissmiss
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p> TABLE: the current time is {new Date().toTimeString()}</p>
    </div>
  );

  const ListAsAFunction = ({ listProp, dev }) => {
    const [list, setList] = useState(listProp);
    const [searchTerm, setSearchTerm] = useState("");

    const onDismiss = objectID => {
      const newList = list.filter(item => item.objectID !== objectID);
      return setList(newList);
    };

    const onSearchChange = event => setSearchTerm(event.target.value);

    return (
      <div>
        <h2>Hello, {dev.getName()}!</h2>
        <h3>The current time is {new Date().toTimeString()}</h3>
        <Search value={searchTerm} onChange={onSearchChange}>
          Search (in function):
        </Search>
        <Table list={list} pattern={searchTerm} onDismiss={onDismiss} /> }
      </div>
    );
  };

  class ListAsClass extends Component {
    constructor(props) {
      super(props);

      this.state = {
        list,
        dev: devClass,
        searchTerm: ""
      };
    }

    onDismiss = objectID => {
      const newList = this.state.list.filter(
        item => item.objectID !== objectID
      );
      this.setState({ list: newList });
    };

    onSearchChange = event => {
      this.setState({ searchTerm: event.target.value });
    };

    render() {
      const { list, dev, searchTerm } = this.state;
      return (
        <div>
          <h2>Hello, {dev.getName()}!</h2>
          <p>APP: the current time is {new Date().toTimeString()}</p>
          <Search value={searchTerm} onChange={this.onSearchChange}>
            Search (in class):
          </Search>
          >
          <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
        </div>
      );
    }
  }

  return (
    <div className="App">
      <ListAsAFunction listProp={list} dev={devFunction} />
      <br />
      <ListAsClass />
    </div>
  );
}

export default App;
