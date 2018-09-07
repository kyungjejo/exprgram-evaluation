import React, { Component } from 'react';
import YouTube from 'react-youtube';
import { Header, List, Radio, Divider, Button, Popup, Checkbox } from 'semantic-ui-react';

export default class Context extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          title: 'Context Label Evaluation',
          start: 85,
          expressionStart: 91,
          expressionEnd: 95,
          end: 106+5,
          videoId: "03ovdS-uzOc",
          interval: false,
          appropriateness: 0,
          similarity: 0,
          grammar: '',
          original: "See, this is what I'm talking about.",
          expr: "See, this is what i said.",
          watched: false,
          grammar_check: false,
        }
        this._onPlay = this._onPlay.bind(this);
        this._onPause = this._onPause.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onChange = this._onChange.bind(this);
      }
    
      render() {
        const { title, start, end, videoId, interval, original, expr, watched, appropriateness, similarity, grammar, grammar_check } = this.state;
        const opts = {
          playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            start: start,
            end: end,
          }
        };
    
        return (
          <div>
            <div className="resources">
              <div className="title">
                <Header as="h1">{title}</Header>
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
                      <div className="question">Is <Popup trigger={<span id='evaluate'>expression B</span>} content={expr}/> grammatically correct?</div>
                      <List className="question-list" horizontal>
                        <List.Item>
                          <strong>No</strong>
                        </List.Item>
                        <List.Item>
                          <Radio name='grammar' onChange={this._onChange} toggle />
                        </List.Item>
                        <List.Item>
                          <strong>Yes</strong>
                        </List.Item>
                      </List>
                      <div>
                      <Checkbox name='grammar_check' onChange={this._onChange} label="Click here if you are done." />
                      </div>
                    </div>
                    :
                    ''
                  }
              
              {
                grammar_check
                ?
                <YouTube
                  id="video"
                  videoId={videoId}
                  opts={opts}
                  onPlay={this._onPlay}
                  onPause={this._onPause}
                  onEnd={this._onEnd}
                />
                :
                ''
              }
            </div>
            {
              watched
              ?
              <div className="tasks" id="tasks">
                <div className="questions">
                  <div className="question-wrapper">
                    <div className="question">In the given context of the video, how appropriate would it to say <Popup trigger={<span id='evaluate'>expression B</span>} content={expr}/> 
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
                {
                  similarity >0
                  ?
                  <List horizontal>
                    <List.Item>
                  <Button textAlign="center" positive>
                    Rewatch
                  </Button>
                  </List.Item>
                  <List.Item>
                  <Button textAlign="center" disabled={!(appropriateness>0 && grammar_check)} primary>
                    Submit
                  </Button>
                  </List.Item>
                  </List>
                  :
                  ''
                }
              </div>
              :
              similarity>0 && grammar_check ? <div><strong>To see the third question, please watch the video first.</strong></div> : ''
            }
            </div>
          </div>
        );
      }
    
      _onChange(event, checked) {
        const name = checked.name;
        if (name === 'appropriateGroup') {
          this.setState({appropriateness: checked.value});
        }
        else if (name === 'similarityGroup') {
          this.setState({similarity: checked.value});
        }
        else if (name === 'grammar') {
          this.setState({grammar: checked.checked ? 1 : 0})
        }
        else if (name === 'grammar_check') {
          this.setState({grammar_check: checked.checked})
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
        else {
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
        console.log(parseInt(time,10));
      }
    
      // Runs when the video starts playing
      _onPlay(event) {
        const { interval, start, end } = this.state;
        if ( event.target.getCurrentTime() < start-1 || event.target.getCurrentTime() > end+1) {
          event.target.seekTo(start);
        }
        console.log(interval);
        if (!interval){
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