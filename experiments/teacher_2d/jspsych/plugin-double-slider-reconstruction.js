var jsPsychDoubleSliderReconstruction = (function (jspsych) {
    'use strict';

    const info = {
        name: "reconstruction",
        parameters: {
            /** A function with a single parameter that returns an HTML-formatted string representing the stimulus. */
            stim_function: {
                type: jspsych.ParameterType.FUNCTION,
                pretty_name: "Stimulus function",
                default: undefined,
            },
            /** The starting value of the stimulus parameter. */
            starting_value_1: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: "Starting value",
                default: 1,
            },
            starting_value_2: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: "Starting value",
                default: 1,
            },
            /** The text that appears on the button to finish the trial. */
            button_label: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Button label",
                default: "Continue",
            },

            // Slider stuff
            /** Sets the minimum value of the slider. */
            min: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Min slider",
                default: 0,
            },
            /** Sets the maximum value of the slider */
            max: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Max slider",
                default: 100,
            },
            /** Sets the step of the slider */
            step: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Step",
                default: 1,
            },
            /** Array containing the labels for the slider. Labels will be displayed at equidistant locations along the slider. */
            labels: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Labels",
                default: [],
                array: true,
            },
            /** Width of the slider in pixels. */
            slider_width: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Slider width",
                default: null,
            },
            /** If true, the participant will have to move the slider before continuing. */
            require_movement: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Require movement",
                default: false,
            },

            /** Any content here will be displayed below the slider. */
            prompt1: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Prompt",
                default: null,
            },
            prompt2: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Prompt",
                default: null,
            },

            /** How long to show the stimulus. */
            stimulus_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Stimulus duration",
                default: null,
            },
            /** How long to show the trial. */
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial duration",
                default: null,
            },
            /** If true, trial will end when user makes a response. */
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Response ends trial",
                default: true,
            },
        },
    };
    /**
     * **reconstruction**
     *
     * jsPsych plugin for a reconstruction task where the subject recreates a stimulus from memory
     *
     * @author Josh de Leeuw, Alicia Chen
     * @see {@link https://www.jspsych.org/plugins/jspsych-reconstruction/ reconstruction plugin documentation on jspsych.org}
     */
    class ReconstructionPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {

            // half of the thumb width value from jspsych.css, used to adjust the label positions
            var half_thumb_width = 7.5;

            var html = '<div id="jspsych-reconstruction-stim-container">' + "</div>";
            // slider 1
            html += '<div id="jspsych-html-slider-response-wrapper" style="margin: 100px 0px;">';
            html +=
                '<div class="jspsych-html-slider-response-container" style="position:relative; margin: 0 auto 3em auto; ';
            if (trial.slider_width !== null) {
                html += "width:" + trial.slider_width + "px;";
            }
            else {
                html += "width:auto;";
            }
            html += '">';
            html +=
                '<input type="range" class="jspsych-slider" value="' +
                trial.starting_value_1 +
                '" min="' +
                trial.min +
                '" max="' +
                trial.max +
                '" step="' +
                trial.step +
                '" id="jspsych-html-slider-response-response1"></input>';
            html += "<div>";
            for (var j = 0; j < trial.labels.length; j++) {
                var label_width_perc = 100 / (trial.labels.length - 1);
                var percent_of_range = j * (100 / (trial.labels.length - 1));
                var percent_dist_from_center = ((percent_of_range - 50) / 50) * 100;
                var offset = (percent_dist_from_center * half_thumb_width) / 100;
                html +=
                    '<div style="border: 1px solid transparent; display: inline-block; position: absolute; ' +
                    "left:calc(" +
                    percent_of_range +
                    "% - (" +
                    label_width_perc +
                    "% / 2) - " +
                    offset +
                    "px); text-align: center; width: " +
                    label_width_perc +
                    '%;">';
                html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + "</span>";
                html += "</div>";
            }
            html += "</div>";
            if (trial.prompt1 !== null) {
                html += trial.prompt1;
            }
            html += "</div>";
            // html += "</div>";

            // slider 2
            // html += '<div id="jspsych-html-slider-response-wrapper" style="margin: 100px 0px;">';
            html +=
                '<div class="jspsych-html-slider-response-container" style="position:relative; margin: 0 auto 3em auto; ';
            if (trial.slider_width !== null) {
                html += "width:" + trial.slider_width + "px;";
            }
            else {
                html += "width:auto;";
            }
            html += '">';
            html +=
                '<input type="range" class="jspsych-slider" value="' +
                trial.starting_value_2 +
                '" min="' +
                trial.min +
                '" max="' +
                trial.max +
                '" step="' +
                trial.step +
                '" id="jspsych-html-slider-response-response2"></input>';
            html += "<div>";
            for (var j = 0; j < trial.labels.length; j++) {
                var label_width_perc = 100 / (trial.labels.length - 1);
                var percent_of_range = j * (100 / (trial.labels.length - 1));
                var percent_dist_from_center = ((percent_of_range - 50) / 50) * 100;
                var offset = (percent_dist_from_center * half_thumb_width) / 100;
                html +=
                    '<div style="border: 1px solid transparent; display: inline-block; position: absolute; ' +
                    "left:calc(" +
                    percent_of_range +
                    "% - (" +
                    label_width_perc +
                    "% / 2) - " +
                    offset +
                    "px); text-align: center; width: " +
                    label_width_perc +
                    '%;">';
                html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + "</span>";
                html += "</div>";
            }
            html += "</div>";
            if (trial.prompt2 !== null) {
                html += trial.prompt2
            }
            html += "</div>";
            html += "</div>";

            // add submit button
            html +=
                '<br><button id="jspsych-html-slider-response-next" class="jspsych-btn" ' +
                (trial.require_movement ? "disabled" : "") +
                ">" +
                trial.button_label +
                "</button>";

            display_element.innerHTML = html;


            // Change slider stim based on current value
            function changeStim() {
                display_element.querySelector("#jspsych-reconstruction-stim-container").innerHTML = trial.stim_function(slider1.value, slider2.value)
            }

            var slider1 = document.getElementById("jspsych-html-slider-response-response1")
            var slider2 = document.getElementById("jspsych-html-slider-response-response2")

            slider1.addEventListener("change", event => {
                changeStim()
            })

            slider2.addEventListener("change", event => {
                changeStim()
            })



            var response = {
                rt: null,
                response: null,
            };

            if (trial.require_movement) {
                const enable_button = () => {
                    display_element.querySelector("#jspsych-html-slider-response-next").disabled = false;
                };
                display_element
                    .querySelector("#jspsych-html-slider-response-response1")
                    .addEventListener("mousedown", enable_button);
                display_element
                    .querySelector("#jspsych-html-slider-response-response1")
                    .addEventListener("touchstart", enable_button);
                display_element
                    .querySelector("#jspsych-html-slider-response-response1")
                    .addEventListener("change", enable_button);
                display_element
                    .querySelector("#jspsych-html-slider-response-response2")
                    .addEventListener("mousedown", enable_button);
                display_element
                    .querySelector("#jspsych-html-slider-response-response2")
                    .addEventListener("touchstart", enable_button);
                display_element
                    .querySelector("#jspsych-html-slider-response-response2")
                    .addEventListener("change", enable_button);
            }
            // end slider stuff


            const end_trial = () => {
                this.jsPsych.pluginAPI.clearAllTimeouts();
                // save data
                var trialdata = {
                    rt: response.rt,
                    stimulus: trial.stimulus,
                    starting_value_1: trial.starting_value_1,
                    starting_value_2: trial.starting_value_2,
                    prompt1: trial.prompt1,
                    prompt2: trial.prompt2,
                    response1: response.response1,
                    response2: response.response2
                };
                display_element.innerHTML = "";
                // next trial
                this.jsPsych.finishTrial(trialdata);
            };

            display_element
                .querySelector("#jspsych-html-slider-response-next")
                .addEventListener("click", () => {
                    // measure response time
                    var endTime = performance.now();
                    response.rt = Math.round(endTime - startTime);
                    response.response1 = display_element.querySelector("#jspsych-html-slider-response-response1").valueAsNumber;
                    response.response2 = display_element.querySelector("#jspsych-html-slider-response-response2").valueAsNumber;
                    if (trial.response_ends_trial) {
                        end_trial();
                    }
                    else {
                        display_element.querySelector("#jspsych-html-slider-response-next").disabled = true;
                    }
                });

            if (trial.stimulus_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(() => {
                    display_element.querySelector("#jspsych-html-slider-response-stimulus").style.visibility = "hidden";
                }, trial.stimulus_duration);
            }
            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
            }
            var startTime = performance.now();

        }
        simulate(trial, simulation_mode, simulation_options, load_callback) {
            if (simulation_mode == "data-only") {
                load_callback();
                this.simulate_data_only(trial, simulation_options);
            }
            if (simulation_mode == "visual") {
                this.simulate_visual(trial, simulation_options, load_callback);
            }
        }
        create_simulation_data(trial, simulation_options) {
            const default_data = {
                rt: this.jsPsych.randomization.sampleExGaussian(2000, 200, 1 / 200, true),
                start_value: trial.starting_value,
                final_value: this.jsPsych.randomization.randomInt(0, Math.round(1 / trial.step_size)) * trial.step_size,
            };
            const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
            this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
            return data;
        }
        simulate_data_only(trial, simulation_options) {
            const data = this.create_simulation_data(trial, simulation_options);
            this.jsPsych.finishTrial(data);
        }
        simulate_visual(trial, simulation_options, load_callback) {
            const data = this.create_simulation_data(trial, simulation_options);
            const display_element = this.jsPsych.getDisplayElement();
            this.trial(display_element, trial);
            load_callback();
            let steps = Math.round((data.final_value - trial.starting_value) / trial.step_size);
            const rt_per_step = (data.rt - 300) / steps;
            let t = 0;
            while (steps != 0) {
                if (steps > 0) {
                    this.jsPsych.pluginAPI.pressKey(trial.key_increase, t + rt_per_step);
                    steps--;
                }
                else {
                    this.jsPsych.pluginAPI.pressKey(trial.key_decrease, t + rt_per_step);
                    steps++;
                }
                t += rt_per_step;
            }
            this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("#jspsych-reconstruction-next"), data.rt);
        }
    }
    ReconstructionPlugin.info = info;

    return ReconstructionPlugin;

})(jsPsychModule);
