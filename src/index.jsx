import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import './style/main.css'

console.clear();

const Header = ({handleSearch, value, triggerSearchApi}) => {
  return (
       <div>
          <h1 className="header-comp"> <span>Movie Catalog</span> <span className="search-box"><Search triggerSearchApi={triggerSearchApi} handleSearch={handleSearch} value={value}/></span><span>Login</span> </h1>
       </div>
  );
}

const Search = ({ handleSearch, value, triggerSearchApi }) => (
  <input
    type="text"
    value={value}
    onChange={event => handleSearch(event)}
    onKeyPress={event => {
                if (event.key === 'Enter') {
                  triggerSearchApi(event)
                }
              }}
    placeholder="Enter Movie name..."
    autoFocus
  />
)

const MovieItemList = ({products, compare}) =>
<div className="grid-container">
    {products && products.map(product =>
      product && <MovieItem product={product} />
    )}
</div>;

const MovieItem = ({product}) =>
<div key={product.imdbID} className="card">
    <div className="bg-img">
      <img src={product.Poster} alt={product.Title} />
    </div>
    <div className="content">
      <div><span>Name : </span><span>{product.Title}</span></div>
      <div><span>Year : </span><span>{product.Year}</span></div>
      <div><span>imdbID : </span><span>{product.imdbID}</span></div>
      <div><span>Type : </span><span>{product.Type}</span></div>
    </div>
  </div>;

// Contaner Component
class TodoApp extends React.Component{
  constructor(props){
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: [],
      searchString : '',
      triggerSearch : false,
      noResult : false,
      isSearchTerm : false,
      page : 1
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.triggerSearchApi = this.triggerSearchApi.bind(this);
    this.apiUrl = 'http://www.omdbapi.com/?i=tt3896198&apikey=fa281222'
  }
  // Lifecycle method
  componentDidMount(){
    // Make HTTP reques with Axios
    axios.get(this.apiUrl)
      .then((res) => {
        // Set state with result
        if(res.data.Response == "True"){
          this.setState({noResult: false, data:res.data, isSearchTerm : false});
        } else {
          this.setState({noResult:true, data:res.data, isSearchTerm : false });
        }
      });
  }

  handleSearch (event) {
    const value = event.target.value.toLowerCase().trim();
    this.setState({isSearchTerm : true, searchString: value });
  }

  triggerSearchApi(event ,page = 1){

    event.preventDefault();
    if(this.state.searchString == ''){
      return true;
    }
    let apiURL = 'http://www.omdbapi.com/?i=tt3896198&apikey=fa281222&s=' + this.state.searchString + "&page=" + page;
    axios.get(apiURL)
    .then((res) => {
      // Set state with result
      if(res.data.Response == "True"){
        this.setState({noResult: false, data:res.data, isSearchTerm : false, page: page});
      } else {
        this.setState({noResult:true, data:res.data, isSearchTerm : false, page: page});
      }
      window.scrollTo(0,0);
    });
  }
  render(){
    // Render JSX
    let products = this.state.data.Search ? this.state.data.Search : [this.state.data];
    let countOfData = this.state.data.totalResults ? this.state.data.totalResults : products.length;
    let { searchString, noResult, page} = this.state;
    return (
      <div className="">
        <div className="">
        <Header handleSearch={this.handleSearch} triggerSearchApi = {this.triggerSearchApi} value={this.state.searchString} />
        </div>
        {searchString && products.length > 0 && !noResult && <div className="search-message">You searched for: {searchString}, {countOfData} results found </div>}
        {products.length > 0 && !noResult && <MovieItemList products={products} />}
        {noResult && <div> No Results Found </div>}
        {products.length > 0 && !noResult && <div className="center"><div className="pagination">
          <a href="#" onClick={event => this.triggerSearchApi(event, page - 1)} >&laquo;</a>
          <a href="#" onClick={event => this.triggerSearchApi(event, 1)} >1</a>
          <a href="#" onClick={event => this.triggerSearchApi(event, 2)} >2</a>
          <a href="#" onClick={event => this.triggerSearchApi(event, 3)} >3</a>
          <a href="#" onClick={event => this.triggerSearchApi(event, 4)} >4</a>
          <a href="#" onClick={event => this.triggerSearchApi(event, 5)} >5</a>
          <a href="#" onClick={event => this.triggerSearchApi(event, page+1)}>&raquo;</a>
        </div></div>}
      </div>
    );
  }
}
render(<TodoApp />, document.getElementById('root'));
