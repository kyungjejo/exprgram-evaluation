import React, { Component } from 'react';
import YouTube from 'react-youtube';
import { Redirect } from 'react-router-dom';
import { Header, List, Radio, Button, Popup } from 'semantic-ui-react';
import { HOST_URL } from './common';

export default class Context extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          title: 'Context Label Evaluation',
          start: 0,
          expressionStart: 5,
          expressionEnd: 7,
          end: 10,
          videoId: "",
          interval: false,
          appropriateness: 0,
          similarity: 0,
          grammar: false,
          original: "This is an error",
          watched: false,
          grammar_check: false,
          expressions: {},
          count: 0,
          target: '',
          workerID: '',
        }
        this._onPlay = this._onPlay.bind(this);
        this._onPause = this._onPause.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onChange = this._onChange.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
      }

      componentDidMount() {
        // console.log(HOST_URL);
        const workerID = Math.random().toString(36).substring(7);
        this.setState({workerID: workerID});
        // this.setState({workerID: this.props.match.params.workerID});
        fetch(HOST_URL+'Context/', {'Access-Control-Allow-Origin':'*'})
          .then(res => res.json())
          .then(result => 
              this.setState(
                {
                  expressions:result,
                  count: this.state.count+1,
                  original: result[this.state.count][0][1]['sent'],
                  start:result[this.state.count][0][1]['start'],
                  end:result[this.state.count][0][1]['end']+5,
                  videoId: result[this.state.count][0][0],
                  expressionStart: result[this.state.count][0][1]['sentStart'],
                  expressionEnd: result[this.state.count][0][1]['sentEnd'],
                  expr: result[this.state.count][1],
                  target: result[this.state.count][0][2],
                  redirect: false,
                }
              )
            );
      }
    
      render() {
        const { title, start, end, videoId, expressions, original, expr, watched, appropriateness, similarity, grammar_check, redirect, count, workerID } = this.state;
        const opts = {
          playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            start: start,
            end: end,
          }
        };
        if (redirect) {
          return <Redirect push to={"/after/"+workerID} />;
        }
    
        return (
          <div>
            <div className="resources">
              <div className="title">
                <Header as="h1">{title} ({count}/{Object.keys(expressions).length})</Header>
              </div>
              <div className="expression-set">
                <div className="expression-target">
                  <strong id='target'>Expression A</strong>: {original}
                </div>
                <div className="expression-to-evaluate">
                <strong id='evaluate'>Expression B</strong>: {expr}
                </div>
              </div>
              <div className="tasks">
                <div className="question-wrapper">
                  <div className="question">Do <Popup trigger={<span id='target'>expression A</span>} content={expr}/> and <Popup trigger={<span id='evaluate'>expression B</span>} content={original}/> deliver the same meaning?</div>
                  <List className="question-list" horizontal>
                    <List.Item>
                      <strong>Not at all</strong>
                    </List.Item>
                    {[1,2,3,4,5,6,7].map((value,index) =>
                      <List.Item key={index}>
                        <Radio label={value} name='similarityGroup' value={value} onChange={this._onChange} checked={value===this.state.similarity}/>
                      </List.Item>
                    )}
                    <List.Item>
                        <strong>Completely</strong>
                      </List.Item>
                  </List>
                </div>
              {
                    similarity > 0
                    ?
                    <div className="question-wrapper">
                      <div className="question">Is <Popup trigger={<span id='evaluate'>expression B</span>} content={expr}/> grammatically correct? (You may ignore punctuation errors)</div>
                      <List className="question-list" horizontal>
                        {/* <List.Item>
                          <strong>No</strong>
                        </List.Item> */}
                        <List.Item>
                          <Radio label='Yes' name='grammar' value='true' onChange={this._onChange} checked={this.state.grammar===1} />
                        </List.Item>
                        <List.Item>
                          <Radio label='No' name='grammar' value='false' onChange={this._onChange} checked={this.state.grammar===0} />
                        </List.Item>
                        {/* <List.Item>
                          <strong>Yes</strong>
                        </List.Item> */}
                      </List>
                    </div>
                    :
                    ''
                  }
              
              {
                grammar_check
                ?
                <div>
                <YouTube
                  id="video"
                  videoId={videoId}
                  opts={opts}
                  onPlay={this._onPlay}
                  onPause={this._onPause}
                  onEnd={this._onEnd}
                />
                <div><strong id='note'>Please refer to the video to complete the third question.</strong></div>
                </div>
                :
                ''
              }
              {
                grammar_check && watched ?
                <div className="tasks" id="tasks">
                  <div className="questions">
                    <div className="question-wrapper">
                      <div className="question">In the given context of the video, how appropriate would it be to say <Popup trigger={<span id='evaluate'>expression B</span>} content={expr}/> 
                      instead of <Popup trigger={<span id='target'>expression A</span>} content={original}/>?</div>
                      <List className="question-list" horizontal>
                        <List.Item>
                          <strong>Not at all</strong>
                        </List.Item>
                        {[1,2,3,4,5,6,7].map((value,index) =>
                          <List.Item key={index}>
                            <Radio label={value} name='appropriateGroup' value={value} onChange={this._onChange} checked={value===this.state.appropriateness}/>
                          </List.Item>
                        )}
                        <List.Item>
                          <strong>Completely</strong>
                        </List.Item>
                      </List>
                    </div>
                  </div>
                  
                    <List horizontal>
                      <List.Item>
                    <Button positive>
                      Rewatch
                    </Button>
                    </List.Item>
                    {
                      similarity >0 && appropriateness>0 && grammar_check
                      ?
                      <List.Item>
                      <Button disabled={!(appropriateness>0 && grammar_check)} primary onClick={this.onClickHandler}>
                        Submit
                      </Button>
                      </List.Item>
                      :
                      ''
                    }
                    </List>
                  </div>
                  :
                  ''
              }
            </div>
            </div>
          </div>
        );
      }
    
      onClickHandler() {
        // console.log('onclickhandler executed')
        const {similarity, appropriateness, grammar, target, expr, expressions, count, workerID, interval} = this.state;
        fetch(HOST_URL+'ContextSave/', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({'workerID': workerID, 'similarity': similarity, 'appropriateness': appropriateness, 'grammar': grammar, 'target': target, 'expr': expr})
        })
        .then((response) => response.json())
        // .then(res => console.log(res))
        if (count<Object.keys(expressions).length)
          this.setState({
            similarity: 0,
            appropriateness: 0,
            grammar: false,
            grammar_check: false,
            watched: expressions[count][0][2] === target ? true : false,
            count: count+1,
            original: expressions[count][0][1]['sent'],
            target: expressions[count][0][2],
            expr: expressions[count][1],
            start:expressions[count][0][1]['start'],
            end:expressions[count][0][1]['end']+5,
            videoId: expressions[count][0][0],
            expressionStart: expressions[count][0][1]['sentStart'],
            expressionEnd: expressions[count][0][1]['sentEnd'],
          })
        else {
          clearInterval(interval);
          this.setState({redirect:true, interval: false})
        }
      }

      _onChange(event, checked) {
        // console.log(checked);
        const name = checked.name;
        if (name === 'appropriateGroup') {
          this.setState({appropriateness: checked.value});
        }
        else if (name === 'similarityGroup') {
          this.setState({similarity: checked.value});
        }
        else if (name === 'grammar') {
          this.setState({grammar: checked.value==='true' ? 1 : 0})
          this.setState({grammar_check: true})
        }
    
      }
    
      // Fetches current time every second
      timeCheck(e) {
        const time = e.target.getCurrentTime();
        const { expressionStart, expressionEnd, start, end } = this.state;
        if ( expressionStart < time && expressionEnd > time) {
          document.getElementById('target').classList.add('highlight');
          document.getElementsByClassName('App')[0].classList.add('highlight');
        }
        else if (document.getElementById('target')){
          document.getElementById('target').classList.remove('highlight');
          document.getElementsByClassName('App')[0].classList.remove('highlight');
        }
        if (end-5 < time) {
          e.target.seekTo(start);
          e.target.pauseVideo();
          this.setState(
            {
              interval: false,
              watched: true
            }
          )
        }
        // console.log(parseInt(time,10));
      }
    
      // Runs when the video starts playing
      _onPlay(event) {
        const { interval, start, end, redirect } = this.state;
        if ( event.target.getCurrentTime() < start-1 || event.target.getCurrentTime() > end+1) {
          event.target.seekTo(start);
        }
        // console.log(interval);
        if (!interval && !redirect){
          this.setState(
            {
              interval: setInterval(() => this.timeCheck(event),1000)
            }
          )
        }
            
      }
    
      // when video is paused
      _onPause(event) {
        const { interval }  = this.state;
        interval ? clearInterval(interval) : '';
        this.setState(
          {
            interval: false
          }
        )
      }
    
      // when video ends
      _onEnd(event) {
        const { interval }  = this.state;
        event.currentTime = this.state.start;
        interval ? clearInterval(interval) : ''
        this.setState(
          {
            interval: false,
            watched: true
          }
        )
      }
}
