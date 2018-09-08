import React, { Component } from 'react';
import YouTube from 'react-youtube';
import { Redirect } from 'react-router-dom';
import { Header, List, Radio, Button, Popup } from 'semantic-ui-react';
import { HOST_URL } from './common';

export default class Expression2 extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          title: 'Expression Evaluation',
          start: 85,
          expressionStart: 91,
          expressionEnd: 95,
          end: 106+5,
          videoId: "03ovdS-uzOc",
          interval1: false,
          interval2: false,
          appropriateness1: 0,
          appropriateness2: 0,
          similarity: 0,
          original: "See, this is what I'm talking about.",
          expr: "See, this is what i said.",
          watched1: false,
          watched2: false,
          expressions: {},
          count: 0,
          target: '',
          workerID: '',
        }
        this._onPlay = this._onPlay.bind(this);
        this._onPause = this._onPause.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onPlay2 = this._onPlay2.bind(this);
        this._onPause2 = this._onPause2.bind(this);
        this._onEnd2 = this._onEnd2.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
      }

      componentDidMount() {
        // console.log(HOST_URL);
        const workerID = Math.random().toString(36).substring(7);
        this.setState({workerID: workerID});
        // this.setState({workerID: this.props.match.params.workerID});
        fetch(HOST_URL+'exprexpr/', {'Access-Control-Allow-Origin':'*'})
          .then(res => res.json())
          .then(result => 
              this.setState(
                {
                  expressions:result,
                  count: this.state.count+1,

                  original: result[this.state.count][0][1]['sent'],
                  expr: result[this.state.count][1][1]['sent'],
                  target1: result[this.state.count][0][2],
                  target2: result[this.state.count][1][2],
                  
                  start1:result[this.state.count][0][1]['start'],
                  end1:result[this.state.count][0][1]['end']+5,
                  videoId1: result[this.state.count][0][0],
                  expressionStart1: result[this.state.count][0][1]['sentStart'],
                  expressionEnd1: result[this.state.count][0][1]['sentEnd'],

                  start2:result[this.state.count][1][1]['start'],
                  end2:result[this.state.count][1][1]['end']+5,
                  videoId2: result[this.state.count][1][0],
                  expressionStart2: result[this.state.count][1][1]['sentStart'],
                  expressionEnd2: result[this.state.count][1][1]['sentEnd'],

                  redirect: false,
                }
              )
            );
      }
    
      render() {
        const { title, start1, end1, videoId1, videoId2, 
            start2, end2, 
            expressions, original, expr, watched1, watched2, appropriateness1, appropriateness2,
            similarity, redirect, count, workerID } = this.state;
        const opts1 = {
          playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            start: start1,
            end: end1,
          }
        };
        const opts2 = {
          playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            start: start2,
            end: end2,
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
                similarity && appropriateness1 === 0 
                ?
                <div>
                <YouTube
                  id="video1"
                  videoId={videoId1}
                  opts={opts1}
                  onPlay={this._onPlay}
                  onPause={this._onPause}
                  onEnd={this._onEnd}
                />
                <div><strong id='note'>Please refer to the video to complete the second question.</strong></div>
                </div>
                :
                ''
              }
              {
                similarity && watched1 ?
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
                            <Radio label={value} name='appropriateGroup1' value={value} onChange={this._onChange} checked={value===this.state.appropriateness1}/>
                          </List.Item>
                        )}
                        <List.Item>
                          <strong>Completely</strong>
                        </List.Item>
                      </List>
                    </div>
                  </div>
                  </div>
                  :
                  ''
              }
              {
                similarity > 0 && appropriateness1 > 0
                ?
                <div>
                <YouTube
                  id="video"
                  videoId={videoId2}
                  opts={opts2}
                  onPlay={this._onPlay2}
                  onPause={this._onPause2}
                  onEnd={this._onEnd2}
                />
                <div><strong id='note'>Please refer to the video to complete the third question.</strong></div>
                </div>
                :
                ''
              }
              {
                similarity > 0 && watched2 ?
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
                            <Radio label={value} name='appropriateGroup2' value={value} onChange={this._onChange} checked={value===this.state.appropriateness2}/>
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
                      similarity >0 && watched2
                      ?
                      <List.Item>
                      <Button disabled={!(appropriateness2>0)} primary onClick={this.onClickHandler}>
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
        const {similarity, appropriateness1, appropriateness2, target1, target2, expressions, count, workerID, interval} = this.state;
        console.log({'workerID': workerID, 'similarity': similarity, 'appropriateness': appropriateness1, 'appropriateness2': appropriateness2, 'target1': target1, 'target2': target2})
        fetch(HOST_URL+'Exprexprsave/', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({'workerID': workerID, 'similarity': similarity, 'appropriateness1': appropriateness1, 'appropriateness2': appropriateness2, 'target1': target1, 'target2': target2})
        })
        .then((response) => response.json())
        // .then(res => console.log(res))
        if (count<Object.keys(expressions).length)
          this.setState({
            similarity: 0,
            appropriateness1: 0,
            appropriateness2: 0,
            watched: expressions[count][0][2] === target1 ? true : false,
            watched2: false,
            count: count+1,

            original: expressions[count][0][1]['sent'],
            expr: expressions[count][1][1]['sent'],
            target1: expressions[count][0][2],
            target2: expressions[count][1][2],
            
            start1:expressions[count][0][1]['start'],
            end1:expressions[count][0][1]['end']+5,
            videoId1: expressions[count][0][0],
            expressionStart1: expressions[count][0][1]['sentStart'],
            expressionEnd1: expressions[count][0][1]['sentEnd'],

            start2:expressions[this.state.count][1][1]['start'],
            end2:expressions[this.state.count][1][1]['end']+5,
            videoId2: expressions[this.state.count][1][0],
            expressionStart2: expressions[this.state.count][1][1]['sentStart'],
            expressionEnd2: expressions[this.state.count][1][1]['sentEnd'],
            interval1: false, 
            interval2: false,

          })
        else {
          clearInterval(interval);
          this.setState({redirect:true, interval1: false, interval2: false})
        }
      }

      _onChange(event, checked) {
        const name = checked.name;
        if (name === 'appropriateGroup1') {
          this.setState({appropriateness1: checked.value});
        }
        else if (name === 'appropriateGroup2') {
          this.setState({appropriateness2: checked.value});
        }
        else if (name === 'similarityGroup') {
          this.setState({similarity: checked.value});
        }
    
      }
    
      // Fetches current time every second
      timeCheck(e) {
        const time = e.target.getCurrentTime();
        const { expressionStart1, expressionEnd1, start1, end1 } = this.state;
        if ( expressionStart1 < time && expressionEnd1 > time) {
          document.getElementById('target').classList.add('highlight');
          document.getElementsByClassName('App')[0].classList.add('highlight');
        }
        else if (document.getElementById('target')){
          document.getElementById('target').classList.remove('highlight');
          document.getElementsByClassName('App')[0].classList.remove('highlight');
        }
        if (end1-5 < time) {
          e.target.seekTo(start1);
          e.target.pauseVideo();
          this.setState(
            {
              interval1: false,
              watched1: true
            }
          )
        }
        // console.log(parseInt(time,10));
      }
    
      // Runs when the video starts playing
      _onPlay(event) {
        const { interval1, start1, end1, redirect } = this.state;
        if ( event.target.getCurrentTime() < start1-1 || event.target.getCurrentTime() > end1+1) {
          event.target.seekTo(start1);
        }
        // console.log(interval);
        if (!interval1 && !redirect){
          this.setState(
            {
              interval1: setInterval(() => this.timeCheck(event),1000)
            }
          )
        }
            
      }
    
      // when video is paused
      _onPause(event) {
        const { interval1 }  = this.state;
        interval1 ? clearInterval(interval1) : '';
        this.setState(
          {
            interval1: false
          }
        )
      }
    
      // when video ends
      _onEnd(event) {
        const { interval1 }  = this.state;
        event.currentTime = this.state.start1;
        interval1 ? clearInterval(interval1) : ''
        this.setState(
          {
            interval1: false,
            watched1: true
          }
        )
      }

      timeCheck2(e) {
        const time = e.target.getCurrentTime();
        const { expressionStart2, expressionEnd2, start2, end2 } = this.state;
        if ( expressionStart2 < time && expressionEnd2 > time) {
          document.getElementById('target').classList.add('highlight');
          document.getElementsByClassName('App')[0].classList.add('highlight');
        }
        else if (document.getElementById('target')){
          document.getElementById('target').classList.remove('highlight');
          document.getElementsByClassName('App')[0].classList.remove('highlight');
        }
        if (end2-5 < time) {
          e.target.seekTo(start2);
          e.target.pauseVideo();
          this.setState(
            {
              interval2: false,
              watched2: true
            }
          )
        }
        // console.log(parseInt(time,10));
      }
    
      // Runs when the video starts playing
      _onPlay2(event) {
        const { interval2, start2, end2, redirect } = this.state;
        if ( event.target.getCurrentTime() < start2-1 || event.target.getCurrentTime() > end2+1) {
          event.target.seekTo(start2);
        }
        // console.log(interval);
        if (!interval2 && !redirect){
          this.setState(
            {
              interval2: setInterval(() => this.timeCheck2(event),1000)
            }
          )
        }
            
      }
    
      // when video is paused
      _onPause2(event) {
        const { interval2 }  = this.state;
        interval2 ? clearInterval(interval2) : '';
        this.setState(
          {
            interval2: false
          }
        )
      }
    
      // when video ends
      _onEnd2(event) {
        const { interval2 }  = this.state;
        event.currentTime = this.state.start2;
        interval2 ? clearInterval(interval2) : ''
        this.setState(
          {
            interval2: false,
            watched2: true
          }
        )
      }
}
