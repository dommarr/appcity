import React from "react";
import Tooltip from "../global/tooltip";
import { supabase } from "../../utils/initSupabase";
import Link from "next/link";
import { InformationCircleIcon } from "@heroicons/react/solid";

const videoType = "video/webm";
const videoTypeMp4 = "video/mp4";

export default class ReviewRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      recording: false,
      link: "",
      recorded: false,
      rating: 0,
      title: "",
      message: "",
      uploading: false,
      firstname: "",
      lastname: "",
      uploadFile: null,
    };
  }

  async componentDidMount() {
    if (this.props.user) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // show it to user
        this.video.srcObject = stream;
        this.video.play();
        // init recording
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: videoType,
        });
        // init data storage for video chunks
        this.chunks = [];
        // listen for data from media recorder
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.chunks.push(e.data);
          }
        };
        this.fetchProfile(this.props.user.id);
      } catch (error) {
        throw error;
      }
    }
  }

  async componentWillUnmount() {
    if (this.props.user) {
      if (this.video.srcObject) {
        this.video.srcObject.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    }
  }

  async getProfile(id) {
    try {
      let response = await supabase.from("users").select("*").eq("id", id);
      return response.data;
    } catch (err) {
      alert(err);
    }
  }

  async fetchProfile(id) {
    try {
      const profileData = await this.getProfile(id);
      if (profileData) {
        profileData[0].first_name ? this.setState({ firstname: profileData[0].first_name }) : "";
        profileData[0].last_name ? this.setState({ lastname: profileData[0].last_name }) : "";
      }
    } catch (error) {
      throw error;
    }
  }

  startRecording(e) {
    e.preventDefault();
    // make stream visible
    this.setState({ visible: true });
    // say that a video is not saved
    this.setState({ recorded: false });
    // say that we're recording
    this.setState({ recording: true });
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);
  }

  reset(e) {
    e.preventDefault();
    // make stream visible
    this.setState({ visible: true });
    // say that a video is not saved
    this.setState({ recorded: false });
  }

  stopRecording(e) {
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({ recording: false });
    // save the video to memory
    this.saveVideo();
    // video is now saved
    this.setState({ recorded: true });
    // hide stream
    this.setState({ visible: false });
  }

  saveVideo() {
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: videoTypeMp4 });
    // reset chunks to empty array
    this.chunks = [];
    // generate video url from blob
    const videoURL = window.URL.createObjectURL(blob);
    // set state
    this.setState({ link: videoURL });
    this.setState({ uploadFile: blob });
  }

  handleClick(num) {
    this.setState({ rating: num });
  }

  handleClose(e) {
    e.preventDefault();
    // stop the recorder
    // say that we're not recording
    this.setState({ recording: false });
    this.props.setReview(false);
  }

  async updateProfile(first, last, id) {
    try {
      const { data, error } = await supabase.from("users").update({ first_name: first, last_name: last }).eq("id", id);
      if (error) {
        this.setState({ message: "There was an error. Please try again." });
        setTimeout(() => {
          this.setState({ message: "" });
        }, 2000);
        throw error;
      }
    } catch (err) {
      this.setState({ uploading: false });
      this.setState({ message: "There was an error. Please try again." });
      setTimeout(() => {
        this.setState({ message: "" });
      }, 2000);
      throw err;
    }
  }

  async signUrl(path) {
    try {
      const { data, error } = await supabase.storage.from("reviews").createSignedUrl(path, 283824000);
      if (error) {
        throw error;
      }
      return data.signedURL;
    } catch (err) {
      throw err;
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ uploading: true });
    // validate a rating is selected
    if (this.state.rating === 0) {
      this.setState({ uploading: false });
      this.setState({ message: "Please select a star rating." });
      setTimeout(() => {
        this.setState({ message: "" });
      }, 2000);
      // validate we have a first and last name
    } else if (this.state.firstname === "" || this.state.lastname === "" || this.state.title === "") {
      this.setState({ uploading: false });
      this.setState({ message: "Please include your first name, last name, and a title." });
      setTimeout(() => {
        this.setState({ message: "" });
      }, 2000);
    } else {
      try {
        // upload video to storage
        let { data, error } = await supabase.storage.from("reviews").upload(`${this.props.user.id}_${this.props.product.id}`, this.state.uploadFile);
        if (error) {
          this.setState({ uploading: false });
          this.setState({ message: "There was an error. Please try again." });
          setTimeout(() => {
            this.setState({ message: "" });
          }, 2000);
          throw error;
        }

        try {
          // update user profile
          this.updateProfile(this.state.firstname, this.state.lastname, this.props.user.id);
          // sign review video and create url for display
          let url = await this.signUrl(`${this.props.user.id}_${this.props.product.id}`);
          // add review to database - reviews table
          let reviewObj = {
            first_name: this.state.firstname,
            last_name: this.state.lastname,
            rating: this.state.rating,
            title: this.state.title,
            product: this.props.product.id,
            user: this.props.user.id,
            path: `${this.props.user.id}_${this.props.product.id}`,
            link: url,
          };
          let { data, error } = await supabase.from("reviews").insert(reviewObj);
          if (error) {
            this.setState({ uploading: false });
            this.setState({ message: "There was an error. Please try again." });
            setTimeout(() => {
              this.setState({ message: "" });
            }, 2000);
            throw error;
          }
          this.props.setReview(false);
          this.props.setSuccess(true);
          setTimeout(() => {
            this.props.setSuccess(false);
          }, 2000);
        } catch (err) {
          this.setState({ uploading: false });
          this.setState({ message: "There was an error. Please try again." });
          setTimeout(() => {
            this.setState({ message: "" });
          }, 2000);
          throw err;
        }
      } catch (err) {
        this.setState({ uploading: false });
        if (err.statusCode === "23505") {
          this.setState({ message: "You have already left a review for this product." });
          setTimeout(() => {
            this.setState({ message: "" });
          }, 2000);
          throw err;
        } else {
          this.setState({ message: "There was an error. Please try again." });
          setTimeout(() => {
            this.setState({ message: "" });
          }, 2000);
          throw err;
        }
      }
    }
  }

  render() {
    const { visible, recording, link, recorded, rating, title, message, uploading, firstname, lastname } = this.state;

    if (!this.props.user)
      return (
        <div className="relative p-8 bg-gray-50 shadow space-y-8">
          <button className="absolute top-1 right-1" onClick={(e) => this.handleClose(e)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-lg">Please sign in to leave a review.</div>
          <div className="flex items-center justify-center space-x-4">
            <Link href={{ pathname: `/profile`, query: { view: "magic_link" } }}>
              <a className={`text-purple hover:bg-gray-200 text-base font-medium border border-purple px-4 py-2`}>Sign in</a>
            </Link>
            <Link href={{ pathname: `/profile`, query: { view: "sign_up" } }}>
              <a className={`text-white bg-purple hover:bg-purple-extradark inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-base font-medium`}>Sign up</a>
            </Link>
          </div>
        </div>
      );

    return (
      <div className="camera relative pb-4 bg-gray-50 shadow">
        <button className="absolute top-1 right-1" onClick={(e) => this.handleClose(e)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h1 className="text-lg font-bold text-gray-900 text-center pt-8">Select a rating and record your review</h1>
        <Tooltip text="Why only video?" caption="Video reviews are more trustworthy. When someone puts their face and name on a video, you can better trust its authenticity." />
        <div className="flex justify-center pt-2 pb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={(e) => this.handleClick(1)}
            className={`h-8 w-8 text-purple stroke-current ${rating > 0 ? "fill-current" : ""} hover:fill-current`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={(e) => this.handleClick(2)}
            className={`h-8 w-8 text-purple stroke-current ${rating > 1 ? "fill-current" : ""} hover:fill-current`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={(e) => this.handleClick(3)}
            className={`h-8 w-8 text-purple stroke-current ${rating > 2 ? "fill-current" : ""} hover:fill-current`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={(e) => this.handleClick(4)}
            className={`h-8 w-8 text-purple stroke-current ${rating > 3 ? "fill-current" : ""} hover:fill-current`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            onClick={(e) => this.handleClick(5)}
            className={`h-8 w-8 text-purple stroke-current ${rating > 4 ? "fill-current" : ""} hover:fill-current`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <form>
          <div className="sm:overflow-hidden">
            <div className="px-4 pb-4">
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Review title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => this.setState({ title: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={firstname}
                    onChange={(e) => this.setState({ firstname: e.target.value })}
                    autoComplete="given-name"
                    required
                    className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                  />
                </div>

                <div className="col-span-4 sm:col-span-2">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={lastname}
                    onChange={(e) => this.setState({ lastname: e.target.value })}
                    autoComplete="family-name"
                    required
                    className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <video
              className={`block ${!visible ? "hidden" : ""}`}
              style={{ width: 400 }}
              muted
              ref={(v) => {
                this.video = v;
              }}
            >
              Video stream not available.
            </video>
            {recorded && link && (
              <div>
                <video style={{ width: 400 }} src={link} autoPlay controls />
              </div>
            )}
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex justify-center">
              {!recording && !recorded && (
                <>
                  <button
                    className="bg-green-500 border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-0"
                    onClick={(e) => this.startRecording(e)}
                  >
                    Record
                  </button>
                </>
              )}
              {!recording && recorded && (
                <div className="space-x-2 flex justify-center items-center">
                  <button
                    onClick={(e) => this.reset(e)}
                    className="bg-green-500 border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-0"
                  >
                    Record again
                  </button>
                  {!uploading && (
                    <button
                      onClick={(e) => this.handleSubmit(e)}
                      type="submit"
                      className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
                    >
                      Submit
                    </button>
                  )}
                  {uploading && (
                    <button className="bg-purple border border-transparent shadow-sm inline-flex py-1.5 px-7 justify-center items-center text-sm font-medium text-white focus:outline-none focus:ring-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              {recording && (
                <button
                  onClick={(e) => this.stopRecording(e)}
                  className="bg-red-500 border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-0"
                >
                  Stop
                </button>
              )}
            </div>
            <div className="flex justify-center text-red-600 font-medium">{message}</div>
          </div>
        </form>
      </div>
    );
  }
}
