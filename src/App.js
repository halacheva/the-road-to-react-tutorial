import React, { Component, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";

function App() {
  const DEFALUT_QUERY = "redux";
  const DEFAULT_PER_PAGE = 10;

  const PATH_BASE = "https://hn.algolia.com/api/v1";
  const PATH_SEARCH = "/search";
  const PARAM_SEARCH = "query=";
  const PARAM_PAGE = "page=";
  const PARAM_PER_PAGE = "hitsPerPage=";

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
    item.title
      ? item.title.toLowerCase().includes(searchTerm.toLowerCase())
      : item;

  const Button = ({ onClick, className = "", children }) => (
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>
  );

  const Search = ({ value, onChange, onSubmit, className, children }) => (
    <div className={className}>
      <form onSubmit={onSubmit}>
        <label htmlFor="input[type=text]">{children}</label>
        <input type="text" value={value} onChange={onChange} />
        <button type="submit" onClick={onSubmit}>
          Submit
        </button>
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
      <div className="app">
        <h2>Hello, {dev.getName()}!</h2>
        <h3>The current time is {new Date().toTimeString()}</h3>
        <Search
          value={searchTerm}
          onChange={onSearchChange}
          onSubmit={null}
          className="search"
        >
          Search (in function):
        </Search>
        <Table list={list} pattern={searchTerm} onDismiss={onDismiss} />
      </div>
    );
  };

  class ListAsClass extends Component {
    constructor(props) {
      super(props);

      this.state = {
        results: null,
        dev: devClass,
        searchKey: "",
        searchTerm: DEFALUT_QUERY
      };
    }

    setSearchTopStories = result => {
      const { hits, page } = result;
      const { searchKey, results } = this.state;
      const oldHits =
        results && results[searchKey] ? this.state.results[searchKey].hits : [];
      const updatedHits = [...oldHits, ...hits];

      this.setState({
        results: { ...results, [searchKey]: { hits: updatedHits, page: page } }
      });
    };

    onDismiss = objectID => {
      const { searchKey, results } = this.state;
      const updatedHits = results[searchKey].hits.filter(
        item => item.objectID !== objectID
      );
      this.setState({
        results: { ...results, [searchKey]: { hits: updatedHits } }
      });
    };

    onSearchChange = event => {
      this.setState({ searchTerm: event.target.value });
    };

    onSearchSubmit = event => {
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm });
      if (!this.state.results[searchTerm]) {
        this.fetchSearchTopStories(searchTerm);
      }
      event.preventDefault();
    };

    componentDidMount() {
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm });
      this.fetchSearchTopStories(searchTerm);
    }

    fetchSearchTopStories = (searchTerm, page = 0) => {
      const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_PER_PAGE}${DEFAULT_PER_PAGE}`;

      fetch(url)
        .then(response => response.json())
        .then(result => this.setSearchTopStories(result))
        .catch(error => error);
    };

    render() {
      const { results, dev, searchKey, searchTerm } = this.state;
      const page =
        (results && results[searchKey] && results[searchKey].page) || 0;
      const list =
        (results && results[searchKey] && results[searchKey].hits) || [];

      return (
        <div>
          <h2>Hello, {dev.getName()}!</h2>
          <p>APP: the current time is {new Date().toTimeString()}</p>
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            className="search"
          >
            Search (in class):
          </Search>
          <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
          <div>
            <Button
              onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
            >
              More
            </Button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="page">
      <ListAsAFunction listProp={list} dev={devFunction} />
      <br />
      <ListAsClass />
    </div>
  );
}

export default App;
