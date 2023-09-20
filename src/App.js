import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import usePrevState from "./hooks/usePrevState";

// * Tracing

//init
//term: state => javascript
//result: state => array: empty   (create state)
//prevTerm: custom hook-> skip use effect -> return undifined
//useEffect API -> skip
//return
//after render 1
//useEffect -> inside custom hook-> use ref -> javascript
//useEffect -> API -> update state -> result



//new render
//term: state => javascript
//result: state -> array: list from wiki
//prevTerm -> custom hook -> return javascript
//return

//after render 2
//useEffect -> inside custom hook-> use ref -> javascript
//useEffect -> API ->      /term: javascript vs prevTerm: javascript


//update input -> update state -> re render
//term: state => javascript2
//result: state => old data
//prevTerm -> custom hook -> javascript
//return

//after render 3
  //useEffect -> inside custom hook-> use ref -> javascript2
    //useEffect -> API -> //term: javascript2 vs prevTerm: javascript => search will run => update state

//re render 4
//term: state => javascript








function App() {
  const [term, setTerm] = useState("javascript");
  const [result, setResult] = useState([]);
  // const termUseRef = useRef();
  const prevTerm = usePrevState(term);

  /*1.
const [term, setTerm] = useState("javascript");
   const [debounceSearch, setDebounceSearch] = useState(term);
   const [result, setResult] = useState([]);

   useEffect(() => {
     const timeOut = setTimeout(() => {
       setDebounceSearch(term);
     }, 1200);
     return () => clearTimeout(timeOut);
   }, [term]);

   useEffect(() => {
     const search = async () => {
       const respond = await axios.get("https:en.wikipedia.org/w/api.php", {
         params: {
           action: "query",
           list: "search",
           origin: "*",
           format: "json",
           srsearch: term,
         },
       });
       setResult(respond.data.query.search);
     };
     search();
   }, [debounceSearch]);
   */

  /*2.
   useEffect(() => {
     termUseRef.current = term;
   });

   const prevTerm = termUseRef.current;
  */

  useEffect(() => {
    const search = async () => {
      const respond = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          srsearch: term,
        },
      });
      setResult(respond.data.query.search);
      // console.log(respond.data.query.search);
    };

    if (!result.length) {
      if (term) {
        search();
      }
      // term: javascript2 vs javascript1
    } else if (term !== prevTerm) {
      const debounceSearch = setTimeout(() => {
        if (term) {
          search();
        }
      }, 1200);
      return () => {
        clearTimeout(debounceSearch);
      };
    }
  }, [term, result.length, prevTerm]);

  // fetch api data
  const fetchResult = result.map((el) => {
    return (
      <tr key={el.pageid}>
        <th>{el.title}</th>

        <th>
          <span dangerouslySetInnerHTML={{ __html: el.snippet }} />
        </th>
      </tr>
    );
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="my-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Search Input
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              onChange={(e) => setTerm(e.target.value)}
              value={term}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Desc</th>
              </tr>
            </thead>
            <tbody>{fetchResult}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
