import React from 'react';
import './App.css';


/*
  Create a searchNews async function, which calls the News API and gets back the news articles JSON back.
  Override the App component, with a search field and a button that calls searchNews, and displays each news item using Item.
  Added the Item commponent which shows each news item in a compact, organized, and aesthetic way.
*/
async function searchNews(q) {
  q = encodeURIComponent(q);
  const response = await fetch(`https://bing-news-search1.p.rapidapi.com/news/search?
freshness=Day&TextFormat=Raw&safeSearch=Strict&q=${q}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
      "x-rapidapi-key": "7524f85dbemshd8e9a46a7ec54b5p1a5e92jsn2fa328630e87",
      "x-bingapis-sdk": "true"
    }
  });
  const body = await response.json();
  return body.value;
}
/* 
  We store the query in state using ReactHooks, using a default value of "docker".
  The list of results is similarly stored in the list variable.
  We start out with a null list, to differentiate between "not yet searched" and "got empty results".
  Our ReactForm uses ControlledComponent for the input field.
*/
function App() {
  const [query, setQuery] = React.useState("docker");
  const [list, setList] = React.useState(null);

  const search = (e) => {
    e.preventDefault();
    searchNews(query).then(setList);
  };

  return (
    <div className="app">

      <form onSubmit={search}>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>

      {!list
        ? null
        : list.length === 0
        ?<p><i>No results</i></p>
        : <ul>
          {list.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </ul>
      }
    </div>
  );
}

/*
  We always show the item's title, description, date, and provider.
  If the article thumbnail, provider's thumbnail, and category are present, we show them too.
  We have two simple helper functions for formatting the date and category.
*/

function Item({ item }) {
  const separateWords = s => s.replace(/[A-Z] [a-z]+/g, '$& ').trim();
  const formatDate =s => new Date(s).toLocaleDateString(undefined, {
    dateStyle: 'long'
  });

  return (
    <li className="item">
      {item.image &&
        <img className="thumbnail"
          alt=""
        src={item.image?.thumbnail?.contentUrl}
      />
    }

    <h2 className="title">
      <a href={item.url}>{item.name}</a>
    </h2>

    <p className="description">
      {item.description}
    </p>

      <div className="meta">
        <span>{formatDate(item.datePublished)}</span>

        <span className="provider">
          {item.provider[0].image?.thumbnail &&
            <img className="provider-thumbnail"
              alt=""
              src={item.provider[0].image.thumbnail.contentUrl + '&w=16&h=16'}
            />
          }
          {item.provider[0].name}
        </span>

        {item.category &&
          <span>{separateWords(item.category)}</span>
        }
      </div>
    </li>
  );
}

export default App;



