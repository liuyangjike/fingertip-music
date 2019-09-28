
class MikuAudio {
  private audioCtx: any
  private gainNode: any
  private fail: boolean
  private cacheBuffer: any
  private bsource: any
  constructor(){
      this.audioCtx = null;
      this.gainNode = null;
      this.fail = false;
      this.cacheBuffer = {};
      this.init();
  }
  init(){
      this.createAudioContext();
      this.createAudioDes();
  }
  createAudioContext(){
      window.AudioContext = window.AudioContext
      try{
          this.audioCtx = new AudioContext();
      }catch(e){
          this.fail = true;
          // alert('Web audio is not supported in this browser');
      }
  }
  createAudioDes(){
      if(this.fail&&!this.audioCtx) return;
      // this.analyser = this.audioCtx.createAnalyser();
      // this.analyser.connect(this.audioCtx.destination);
      this.bsource = this.audioCtx.createBufferSource();
      this.bsource.loop = false;
  }
  play(as:any,bid: any){
      let that = this;
      if(that.fail&&!that.audioCtx) return;
      that.createAudioDes();
      that.audioCtx.source = null;
      if(bid&&that.cacheBuffer[bid]){
          that.bsource.buffer = that.cacheBuffer[bid];
          that.bsource.connect(this.audioCtx.destination);
          that.bsource.start();   
      }else{
          that.audioCtx.decodeAudioData(as.buffer,(buffer: any)=>{
              if(bid) that.cacheBuffer[bid] = buffer;
              that.bsource.buffer = buffer;
              that.bsource.connect(this.audioCtx.destination);
              that.bsource.start();   
          },(err: any)=>{
              console.log(err);
          })
      }
  }
}

export default MikuAudio