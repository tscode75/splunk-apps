'use strict';

require(
    [
        'jquery',
        'underscore',
        'backbone',
        "splunk.util"

    ],
    function(
        $,
        _,
        Backbone,
        splunkUtil
    ) {

        function clearLocalStorage() {
            for (var key in localStorage) { if (key.indexOf("sse-") != "-1") { delete localStorage[key] } }
        }

        var localStoragePreface = "sse";



        function doBump() {
            // console.log("I'm bumping!")
            $.ajax({
                url: Splunk.util.make_full_url("/_bump"),
                type: 'GET',
                async: false,
                success: function(returneddata) {
                    let baseBump = returneddata;
                    let postValue = $(baseBump).find("input[type=hidden]").val();
                    //console.log("Initial Bump Page", returneddata);
                    $.ajax({
                        url: Splunk.util.make_full_url("/_bump"),
                        type: 'POST',
                        data: "splunk_form_key=" + postValue,
                        async: false,
                        success: function(returneddata) {
                            // console.log("Final Bump", returneddata); 
                        },
                        error: function(xhr, textStatus, error) {
                            // console.error("Error Updating!", xhr, textStatus, error);
                        }
                    })
                },
                error: function(xhr, textStatus, error) {
                    // console.error("Error Updating!", xhr, textStatus, error);
                }
            })
        }

        function deferralGetCurrentAppVersion(deferral) {
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/services/apps/local?output_mode=json&count=0',
                type: 'GET',
                async: false,
                success: function(returneddata) {
                    for (let i = 0; i < returneddata['entry'].length; i++) {
                        if (returneddata['entry'][i]['name'] == "Splunk_Security_Essentials") {
                            let version = returneddata['entry'][i]['content']['version']
                            deferral.resolve(version)
                        }
                    }
                },
                error: function(xhr, textStatus, error) {
                    // console.error("Error Updating!", xhr, textStatus, error);
                }
            })
        }

        function deferralHaveAdminAllObjectRights(deferral) {
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/authentication/current-context?output_mode=json&count=0',
                type: 'GET',
                async: false,
                success: function(returneddata) {
                    if (returneddata.entry[0].content.capabilities.indexOf("admin_all_objects") >= 0) {
                        deferral.resolve(true)
                    } else {
                        deferral.resolve(false)
                    }
                },
                error: function(xhr, textStatus, error) {
                    // console.error("Error Updating!", xhr, textStatus, error);
                }
            })
        }

        function checkForUpdatedVersionAndBump() {
            // https://answers.splunk.com/answers/390115/how-do-you-programmatically-bump-a-search-head.html#answer-738784
            let versionDeferral = $.Deferred();
            let accessDeferral = $.Deferred();
            deferralGetCurrentAppVersion(versionDeferral);
            deferralHaveAdminAllObjectRights(accessDeferral);
            $.when(versionDeferral, accessDeferral).then(function(version, haveAccess) {
                //console.log("Starting analysis", version, haveAccess, localStorage[localStoragePreface + "-last-used-version"]);
                if ((!localStorage[localStoragePreface + "-last-used-version"] || localStorage[localStoragePreface + "-last-used-version"] != version) && haveAccess) {
                    doBump()
                    localStorage[localStoragePreface + "-last-used-version"] = version;
                }
            })
        }


        checkForUpdatedVersionAndBump();
        var allFilters = [{ //This is from the list of all filters for the modal, not for the default!
                "fieldName": "journey",
                "displayName": _("Journey").t(),
                "type": "search",
                "export": "yes",
                "itemSort": JourneyStageIds, //JourneyAdjustment //NumJourneys
                "style": "height: 1.75em;",
                "width": "250px",
                "ulStyle": "column-count: 1;",
                "manipulateDisplay": function(label) {
                    //console.log("Manipulating label..", label)
                    label = label.replace("_", " ")
                    if (typeof JourneyStageNames[parseInt(label.replace("Stage ", ""))] != "undefined") {
                        label = label + " - " + JourneyStageNames[parseInt(label.replace("Stage ", ""))]
                    }
                    return label
                },
                "tooltip": _("Splunk's Security Journey maps examples to relative technical maturity of a Splunk deployment, letting newcomers focus on the basics and advanced users target their needs.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "usecase",
                "displayName": _("Security Use Case").t(),
                "type": "search",
                "export": "yes",
                "itemSort": [_("Security Monitoring").t(), _("Compliance").t(), _("Advanced Threat Detection").t(), _("Incident Investigation & Forensics").t(), _("Incident Response").t(), _("SOC Automation").t(), _("Insider Threat").t(), _("Fraud Detection").t(), _("Application Security").t(), _("Other").t()],
                "style": "height: 1.75em; width: 225px;",
                "headerStyle": "width: 225px",
                "width": "225px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Shows the high level use case of an example.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "category",
                "displayName": _("Category").t(),
                "type": "search",
                "export": "yes",
                "style": "width:220px; padding-bottom: 2px; display: inline-block",
                "headerStyle": "width: 240px",
                "width": "240px",
                "ulStyle": "column-count: 1 !important;",
                "tooltip": _("Shows the more detailed category of an example.").t()
            }, { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "datasource",
                "displayName": _("Data Sources").t(),
                "type": "search",
                "export": "yes",
                "style": "width:250px; padding-bottom: 2px; display: inline-block",
                "headerStyle": "width: 550px",
                "width": "250px",
                "ulStyle": "column-count: 2;",
                "tooltip": _("The data sources that power ths use cases. These are mapped to individual technologies.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "highlight",
                "displayName": _("Featured").t(),
                "type": "exact",
                "width": "150px",
                "export": "yes",
                "style": " padding-bottom: 2px; width: 150px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Featured searches are those that come highly recommended by Splunk's Security SMEs.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "alertvolume",
                "displayName": _("Alert Volume").t(),
                "type": "exact",
                "width": "120px",
                "export": "yes",
                "itemSort": ["Low", "Medium", "High", "None"],
                "style": "height: 1.75em; display: inline-block; width: 120px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Shows whether an example is expected to generate a high amount of noise, or should be high confidence. ").t()
            }, { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "domain",
                "displayName": _("Domain").t(),
                "type": "exact",
                "export": "yes",
                "style": "height: 1.75em; width: 175px;",
                "width": "175px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("What high level area of security does this apply to, such as Endpoint, Access, or Network.").t()
            }, //This is from the list of all filters for the modal, not for the default! 
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "mitre_tactic_display",
                "displayName": _("ATT&CK Tactic").t(),
                "type": "search",
                "export": "yes",
                "itemSort": ["Persistence", "Privilege Escalation", "Defense Evasion", "Credential Access", "Discovery", "Lateral Movement", "Execution", "Collection", "Exfiltration", "Command and Control"],
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Tactics are the higher-level categories (containing many techniques) from MITRE ATT&CK and PRE-ATT&CK. MITRE???s Adversarial Tactics, Techniques, and Common Knowledge (ATT&CK???) is a curated knowledge base and model for cyber adversary behavior, reflecting the various phases of an adversary???s lifecycle and the platforms they are known to target. ATT&CK is useful for understanding security risk against known adversary behavior, for planning security improvements, and verifying defenses work as expected. <br /><a href=\"https://attack.mitre.org/wiki/Main_Page\">Read More...</a>").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "mitre_technique_display",
                "displayName": _("ATT&CK Technique").t(),
                "type": "search",
                "export": "yes",
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Techniques are the detailed capabilities from MITRE ATT&CK and PRE-ATT&CK. MITRE???s Adversarial Tactics, Techniques, and Common Knowledge (ATT&CK???) is a curated knowledge base and model for cyber adversary behavior, reflecting the various phases of an adversary???s lifecycle and the platforms they are known to target. ATT&CK is useful for understanding security risk against known adversary behavior, for planning security improvements, and verifying defenses work as expected. <br /><a href=\"https://attack.mitre.org/wiki/Main_Page\">Read More...</a>").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "mitre_threat_groups",
                "displayName": _("MITRE Threat Groups").t(),
                "type": "search",
                "export": "yes",
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("MITRE ATT&CK and PRE-ATT&CK map out the threat groups that are known to use particular techniques. This is of particular value for organizations who have a solid understanding of who their attackers are, and can build defenses specifically tied to those attacking groups.<a href=\"https://attack.mitre.org/wiki/Main_Page\">Read More...</a>").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "data_source_categories_display",
                "displayName": _("Data Source Category").t(),
                "type": "search",
                "export": "yes",
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("New in SSE 2.4, this more detailed data source allows us to build a closer link between the data in your environment and the content that Splunk creates").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "data_available",
                "displayName": _("Data Availability").t(),
                "type": "search",
                "export": "yes",
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("New in SSE 2.4, if you've completed the data foundation configuration, you can filter for example the content that you have the data to run!").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "enabled",
                "displayName": _("Content Enabled").t(),
                "type": "search",
                "export": "yes",
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "width": "200px",
                "ulStyle": "column-count: 1;",
                "tooltip": _("New in SSE 2.4, you can easily track what content you have enabled, allowing you to filter for content that you have turned on or content that you don't.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "killchain",
                "displayName": _("Kill Chain Phase").t(),
                "type": "search",
                "width": "200px",
                "export": "yes",
                "itemSort": ["Reconnaissance", "Weaponization", "Delivery", "Exploitation", "Installation", "Command and Control", "Actions on Objective"],
                "style": "height: 1.75em; width: 200px;",
                "headerStyle": "width: 200px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("Developed by Lockheed Martin, the Cyber Kill Chain?? framework is part of the Intelligence Driven Defense?? model for identification and prevention of cyber intrusions activity. The model identifies what the adversaries must complete in order to achieve their objective. The seven steps of the Cyber Kill Chain?? enhance visibility into an attack and enrich an analyst???s understanding of an adversary???s tactics, techniques and procedures.<br/><a href=\"https://www.lockheedmartin.com/us/what-we-do/aerospace-defense/cyber/cyber-kill-chain.html\">Read More...</a>").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "hasSearch",
                "displayName": _("Search Included").t(),
                "type": "exact",
                "export": "yes",
                "width": "180px",
                "style": "height: 1.75em; width: 180px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("This filter will let you include only those searches that come with Splunk Security Essentials (and aren't from Premium Apps)").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "SPLEase",
                "displayName": _("SPL Difficulty").t(),
                "type": "exact",
                "export": "yes",
                "width": "180px",
                "style": "height: 1.75em; width: 180px;",
                "itemSort": ["Basic", "Medium", "Hard", "Advanced", "Accelerated"],
                "ulStyle": "column-count: 1;",
                "tooltip": _("If you are using Splunk Security Essentials to learn SPL, you can filter here for the easier or more difficult SPL.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "displayapp",
                "displayName": _("Originating App").t(),
                "type": "search",
                "export": "yes",
                "width": "180px",
                "style": " padding-bottom: 2px; width: 300px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("The source of the search, whether it is Splunk Enterprise Security, UBA, or Splunk Security Essentials").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "advancedtags",
                "displayName": _("Advanced").t(),
                "type": "search",
                "width": "180px",
                "style": "height: 1.75em; width: 180px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("A catch-all of several other items you might want to filter on.").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "bookmark_status_display",
                "displayName": _("Bookmarked").t(),
                "type": "search",
                "export": "yes",
                "width": "180px",
                "style": "height: 1.75em; width: 180px;",
                "ulStyle": "column-count: 1;",
                "itemSort": ["Not Bookmarked", "Waiting on Data", "Ready for Deployment", "Needs Tuning", "Issues Deploying", "Successfully Implemented"],
                "tooltip": _("Examples you are tracking").t()
            }, //This is from the list of all filters for the modal, not for the default!
            { //This is from the list of all filters for the modal, not for the default!
                "fieldName": "released",
                "displayName": _("Released Version").t(),
                "type": "search",
                "width": "180px",
                "style": "height: 1.75em; width: 180px;",
                "ulStyle": "column-count: 1;",
                "tooltip": _("A little used filter, shows when the example was first released.").t()
            } //This is from the list of all filters for the modal, not for the default!
        ];

        // Specific workaround for migrating from 2.0-beta to 2.0 final
        if (typeof localStorage[localStoragePreface + '-journey-Multiple'] != "undefined" && localStorage[localStoragePreface + '-journey-Multiple'].indexOf("Stage 1") >= 0) {
            clearLocalStorage()
        }


        // Enable drilldown link to set specific filters
        if (window.location.hash && window.location.hash.substr(1)) {
            // First clear any existing filters
            allFilters.forEach(function(filter) {
                // console.log("Going after", filter.fieldName, localStoragePreface + "-" + filter.fieldName, localStoragePreface + "-" + filter.fieldName + "-Multiple")
                if (filter.fieldName == "journey") {
                    localStorage[localStoragePreface + "-" + filter.fieldName] = "Stage_6"
                    localStorage[localStoragePreface + "-" + filter.fieldName + "-Multiple"] = JSON.stringify(["Stage_1", "Stage_2", "Stage_3", "Stage_4", "Stage_5", "Stage_6"])
                } else {
                    localStorage[localStoragePreface + "-" + filter.fieldName] = "ALL"
                    localStorage[localStoragePreface + "-" + filter.fieldName + "-Multiple"] = JSON.stringify(["ALL"])
                }
            });


            // courtesy of https://stackoverflow.com/questions/5646851/split-and-parse-window-location-hash
            var hash = window.location.hash.substring(1);
            var params = {}
            hash.split('&').map(hk => {
                let temp = hk.split('=');
                params[temp[0]] = temp[1]
            });
            for (let key in params) {
                let filterConfig = {}
                if (key == "search") {
                    localStorage["sse-deeplink-search"] = decodeURIComponent(params[key]);
                    continue;
                }
                for (let i = 0; i < allFilters.length; i++) {
                    if (allFilters[i].fieldName == key) {
                        filterConfig = allFilters[i]
                    }
                }
                if (Object.keys(filterConfig).length) {
                    let enabledFilters = []
                        // enable the filter
                    if (localStorage[localStoragePreface + '-enabledFilters']) {
                        enabledFilters = JSON.parse(localStorage[localStoragePreface + '-enabledFilters'])
                    }
                    if (enabledFilters.indexOf(key) == -1) {
                        enabledFilters.push(key)
                        localStorage[localStoragePreface + '-enabledFilters'] = JSON.stringify(enabledFilters)
                    }
                    params[key] = decodeURIComponent(params[key])
                        // console.log("Setting localStorage:", key, params[key])
                        //set the filter value
                    localStorage[localStoragePreface + "-" + key] = params[key]; // This is the singular, which I don't believe is used anymore.. but I still have been setting. For whatever reason.
                    localStorage[localStoragePreface + "-" + key + "-Multiple"] = JSON.stringify(params[key].split("|")) // This is what's actually use, and supports multiple values.
                }
            }
            window.location.hash = ""
        }


        window.HowManyInScopeChecks = 0;

        window.InScopeHash = new Object()
        window.ShowcaseHTML = new Object()
        window.InScopeNames = new Object()
        window.filterCallBack = new Object;
        window.DoNotPopulate = new Object;

        var JourneyStageNames = ["N/A", _("Collection").t(), _("Normalization").t(), _("Expansion").t(), _("Enrichment").t(), _("Automation and Orchestration").t(), _("Advanced Detection").t(), _("Other").t()]
        var JourneyStageIds = ["Stage_1", "Stage_2", "Stage_3", "Stage_4", "Stage_5", "Stage_6"]
        var JourneyStageDescriptions = ["N/A",
            _("You have the data onboard, what do you do first?").t(),
            _("You've applied Common Information Model, opening you to detections shared from others, and premium apps.").t(),
            _("You're ingesting advanced data sources and running better investigations.").t(),
            _("You are business aware, with Splunk aware of assets, identities, vulnerabilities, and threat intelligence.").t(),
            _("You are monitoring your SOC with Splunk.").t(),
            _("You have the highest level of detection!").t()
        ]
        require(['jquery', 'underscore', 'splunkjs/mvc/simplexml/controller', 'splunkjs/mvc/dropdownview', 'splunk.util', 'components/data/parameters/RoleStorage', 'Options', 'app/Splunk_Security_Essentials/components/controls/Modal', 'json!' + $C['SPLUNKD_PATH'] + '/services/SSEShowcaseInfo?locale=' + window.localeString, "components/data/sendTelemetry", "components/controls/BuildTile", Splunk.util.make_full_url("/static/app/Splunk_Security_Essentials/vendor/lunr.js/lunr.js"), 'bootstrap.popover'], function($, _, DashboardController, DropdownView, SplunkUtil, RoleStorage, Options, Modal, ShowcaseInfo, Telemetry, BuildTile, lunr) {

            $("#desc1_link").click(function() {
                $(".journey").css("display", "block").css("width", "100%")
                if ($("#desc1_arrow").attr("class") == "arrow-right-big") {
                    $("#desc1_arrow").attr("class", "arrow-down-big")
                    $("#desc1Section").css("display", "block");
                } else {
                    $("#desc1_arrow").attr("class", "arrow-right-big")
                    $("#desc1Section").css("display", "none");
                }
                return false;
            })


            $("#desc2_link").click(function() {
                $(".journey").css("display", "block").css("width", "100%")
                if ($("#desc2_arrow").attr("class") == "arrow-right-big") {
                    $("#desc2_arrow").attr("class", "arrow-down-big")
                    $("#desc2Section").css("display", "block");
                } else {
                    $("#desc2_arrow").attr("class", "arrow-right-big")
                    $("#desc2Section").css("display", "none");
                }
                return false;
            })


            window.ShowcaseInfo = ShowcaseInfo
            var showcasesByRole = ShowcaseInfo.roles;
            var showcaseSummaries = ShowcaseInfo.summaries;
            var ListOfShowcases = Object.keys(ShowcaseInfo.summaries)

            for (let i = 0; i < ListOfShowcases.length; i++) {
                if (typeof ShowcaseInfo["summaries"][ListOfShowcases[i]]['includeSSE'] == "undefined" || ShowcaseInfo["summaries"][ListOfShowcases[i]]['includeSSE'].toLowerCase() != "yes") {
                    delete ShowcaseInfo['summaries'][ListOfShowcases[i]]
                    var index = ShowcaseInfo['roles']['default']['summaries'].indexOf(ListOfShowcases[i])
                    if (index >= 0) {
                        ShowcaseInfo['roles']['default']['summaries'].splice(index, 1)
                    }
                }
            }


            for (var showcaseCounter = 0; showcaseCounter < ListOfShowcases.length; showcaseCounter++) {
                var showcaseSettings = ShowcaseInfo.summaries[ListOfShowcases[showcaseCounter]]

                if (showcaseSettings != null) {
                    window.ShowcaseHTML[showcaseSettings['name']] = BuildTile.build_tile(showcaseSettings, false)
                    window.InScopeNames[showcaseSettings['name']] = true
                }




            }

            var showcaseList = $('<ul class="showcase-list"></ul>');
            var showcaseFullList = $('<ul class="showcase-list"></ul>');
            var showcaseHighlightList = $('<ul class="showcase-list"></ul>');

            var AllShowcases = []
            var AllShowcasesCount = []
            for (var i = 0; i <= JourneyStageNames.length; i++) {
                AllShowcases.push($('<ul class="showcase-list"></ul>'))
                AllShowcasesCount.push(0)
            }


            var filters = [

            ];

            var documents = [];
            var fields = ["description", "display_app", "story", "name", "relevance", "searchKeywords", "gdprtext", "knownFP", "category", "howToImplement"];
            for (var SummaryName in window.ShowcaseInfo['roles']['default']['summaries']) {
                SummaryName = window.ShowcaseInfo['roles']['default']['summaries'][SummaryName]
                if (typeof window.ShowcaseInfo['summaries'][SummaryName] == "object") {
                    var myobj = { "id": SummaryName };
                    for (var myfield in fields) {
                        myfield = fields[myfield]
                        if (typeof window.ShowcaseInfo['summaries'][SummaryName][myfield] != "undefined") {
                            myobj[myfield] = window.ShowcaseInfo['summaries'][SummaryName][myfield]
                        }
                    };
                    documents.push(myobj)
                }
            }

            var index = lunr(function() {
                this.field('description', {
                    boost: 3
                });
                this.field('display_app', {
                    boost: 3
                });
                this.field('searchKeywords', {
                    boost: 5
                });
                this.field('name', {
                    boost: 5
                });
                this.field('relevance', {
                    boost: 2
                });
                this.field('gdprtext', {
                    boost: 1
                });
                this.field('story', {
                    boost: 5
                });
                this.field('knownFP', {
                    boost: 1
                });
                this.field('category', {
                    boost: 3
                });
                this.field('howToImplement', {
                    boost: 1
                });
                this.ref('id');


                documents.forEach(function(doc) {
                    this.add(doc)
                }, this)
            });


            var indexSearch = function(mycriteria) {
                return index.search(mycriteria);
            }
            $("#searchIcon").click(function() {
                if ($("#searchbarDiv").css("display") == "none") {
                    $("#searchbarDiv").show()
                    $("#searchBar").focus()
                    if ($("#searchBar").val().length > 0) {
                        doSearch()
                        $("#searchCloseIcon").css("visibility", "visible")
                    }
                } else {
                    $("#searchbarDiv").hide()
                    $("#hiddenValues").html("")
                    for (var SummaryName in window.InScopeNames) {
                        if (window.InScopeNames[SummaryName] == true) {
                            $("#" + SummaryName.replace(/[\. ]/g, "_").replace(/[^\. \w]*/g, "")).removeClass("topSearchHit").show()
                        }
                    }
                }
            })
            $("#searchCloseIcon").click(function() {
                $("#searchCloseIcon").css("visibility", "hidden")
                $("#searchBar").val("")
                $("#hiddenValues").html("")
                for (var SummaryName in window.InScopeNames) {
                    if (window.InScopeNames[SummaryName] == true) {
                        $("#" + SummaryName.replace(/[\. ]/g, "_").replace(/[^\. \w]*/g, "")).removeClass("topSearchHit").show()
                    }
                }
            })

            var timeoutId = 0;
            $("#searchBar").on('keyup', function(e) {
                var code = e.keyCode || e.which;
                if ($("#searchBar").val().length > 0 || (code > 47 && code < 58) || (code > 64 && code < 91) || (code > 96 && code < 123)) {
                    $("#searchCloseIcon").css("visibility", "visible")
                } else {
                    $("#searchCloseIcon").css("visibility", "hidden")
                }
                if (code == 13) {
                    clearTimeout(timeoutId);
                    doSearch()
                } else if ($("#searchBar").val().length >= 4) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(doSearch, 500);
                }
            });

            var doSearch = function() {
                var results = indexSearch($("#searchBar").val())
                    // console.log("Here are my search results against '" + $("#searchBar").val() + "'", results)
                var toShow = {};
                for (var i = 0; i < results.length; i++) {
                    if (results[i].score > 2) {}
                    toShow[window.ShowcaseInfo.summaries[results[i].ref].name] = results[i].score
                        //toShow[results[i].doc.name] = true
                }
                // console.log("Here are my search items", toShow)
                $(".showcaseItemTile").removeClass("topSearchHit").hide()
                var hiddenCounter = 0
                for (var SummaryName in window.InScopeNames) {
                    if (typeof toShow[SummaryName] == "undefined") {
                        //$("#" + SummaryName.replace(/[\. ]/g, "_").replace(/[^\. \w]*/g, "")).hide()

                    } else {
                        if (window.InScopeNames[SummaryName] == true) {
                            $("#" + SummaryName.replace(/[\. ]/g, "_").replace(/[^\. \w]*/g, "")).show()
                            if (toShow[SummaryName] > 20) {
                                $("#" + SummaryName.replace(/[\. ]/g, "_").replace(/[^\. \w]*/g, "")).addClass("topSearchHit")
                            }
                        } else {
                            hiddenCounter++;
                        }

                    }
                }
                if (hiddenCounter > 0) {
                    var link = $('<a href="#">' + "(" + hiddenCounter + " hidden by filters)" + '</a>')
                    link.click(function() {
                        resetNav();
                        doSearch();
                        //$("#searchIcon").click()
                    })
                    $("#hiddenValues").html(link)
                } else {
                    $("#hiddenValues").html("")
                }
            }
            window.doSearch = doSearch
            window.index = index
            if (typeof localStorage["sse-deeplink-search"] != "undefined" && localStorage["sse-deeplink-search"] != "") {
                setTimeout(function() {
                    // console.log("Kicking it off", localStorage["sse-deeplink-search"])
                    $("#searchbarDiv").show()
                    $("#searchBar").val(localStorage["sse-deeplink-search"])
                    if ($("#searchBar").val().length > 0) {
                        doSearch()
                        $("#searchCloseIcon").css("visibility", "visible")
                    }
                    delete localStorage["sse-deeplink-search"]
                }, 1000)
            }
            var AllFilterFields = new Object()
            var SelectedFilterFields = new Object()
            for (var i = 0; i < allFilters.length; i++) {
                AllFilterFields[allFilters[i].fieldName] = 1
                allFilters[i].localStorage = localStoragePreface + "-" + allFilters[i].fieldName
                window.filterCallBack[allFilters[i].localStorage.split("-")[1]] = []
            }
            //   console.log("Just updated my filters...", allFilters)
            var UpdateFilters = function(arrayOfFilterFieldNames) {
                filters = []
                SelectedFilterFields = new Object;
                arrayOfFilterFieldNames.forEach(function(myFilter, myCount) {

                    var filteredFilter = allFilters.filter(function(a) {
                        return a.fieldName == myFilter
                    });
                    if (filteredFilter.length > 0) {
                        filteredFilter[0]['sortOrder'] = myCount
                        filters[myCount] = filteredFilter[0]
                        SelectedFilterFields[filteredFilter[0]['fieldName']] = 1
                    }

                })

                var filteredFilter = filters.filter(function(a) {
                    return a.fieldName == "journey"
                });

                if (filteredFilter.length == 0) {
                    var journeyFilter = allFilters.filter(function(a) {
                        return a.fieldName == "journey"
                    });
                    journeyFilter[0]['sortOrder'] = filters.length
                    filters.push(journeyFilter[0])
                }

                localStorage[localStoragePreface + "-enabledFilters"] = JSON.stringify(arrayOfFilterFieldNames)

                setUpNav()
            }

            var initModal = function() { //this function is actually called at the end, because it depends on the enabledFilters being defined, which requires page load for a first time user.
                var myModal = new Modal('modalAdjustFilters', {
                    title: 'Customize Filters',
                    destroyOnHide: true,
                    type: 'wide'
                });


                $(myModal.$el).on("hide", function() {
                    // Not taking any action on hide, but you can if you want to!
                })

                myModal.body.addClass('mlts-modal-form-inline')
                    //.append(body)

                myModal.footer.append($('<button>').addClass('mlts-modal-submit').attr({
                    type: 'button',
                    'data-dismiss': 'modal'
                }).addClass('btn btn-primary mlts-modal-submit').attr("id", "saveNewFilters").text('Save').on('click', function() {
                    // console.log("Closing modal..")
                }))
                window.FiltersModal = myModal; // Launch it!
            }


            window.ChangeFilters = function ChangeFilters() {
                //  console.log("Here are my current filters", filters)
                //  console.log("Here's my current highlighted status, in ChangeFilters, on my way to Show Modal", localStorage[localStoragePreface + '-highlight'], localStorage[localStoragePreface + '-highlight-Multiple'])
                window.FiltersModal.show()
            }

            $(document).on('shown.bs.modal', '#modalAdjustFilters', function(modal) {




                var bodyContent = "<p style=\"display: block\">" + _("Below is a list of optional filters to use. Please select any that you would like.").t() + "</p><form id=\"allfilterslists\"><ul id=\"filterlistul\" style=\"list-style: none;\">"
                for (var i = 0; i < allFilters.length; i++) {
                    var checkedtext = ""
                    var filteredFilter = JSON.parse(localStorage[localStoragePreface + "-enabledFilters"]).filter(function(a) {
                        return a == allFilters[i].fieldName
                    });

                    if (filteredFilter.length > 0) {
                        checkedtext = " checked"
                    }
                    tooltipText = ""

                    bodyContent += '<div class="tooltipcontainer  filterItem"><label class="filterswitch">' /* + tooltipText*/ + '<input type="checkbox" id="FILTER_' + allFilters[i].fieldName + '" name="FILTER_' + allFilters[i].fieldName + '"' + checkedtext + '><span class="filterslider "></span></label><div class="filterLine">' + allFilters[i].displayName + '</div></div> '

                }
                bodyContent += "</ul></form>"

                $(".mlts-modal-form-inline").html(bodyContent)




            })
            $(document).on('hide.bs.modal', '#modalAdjustFilters', function() {

                var newFilterChoices = []



                $("#allfilterslists").find("input:checked").each(function(a, b) {
                        var filterName = $(b).attr("id").replace("FILTER_", "")
                        newFilterChoices.push(filterName)
                    })
                    // console.log("Here's my current highlighted status, in hide.bs.modal, on my way to UpdateFilters", localStorage[localStoragePreface + '-highlight'], localStorage[localStoragePreface + '-highlight-Multiple'])
                UpdateFilters(newFilterChoices)
            });



            filters.sort(function(a, b) {
                if (a.sortOrder > b.sortOrder) {
                    return 1;
                }
                if (a.sortOrder < b.sortOrder) {
                    return -1;
                }
                return 0;
            });


            var setRole = function setRole(roleName) {
                showcaseList.empty();
                showcaseFullList.empty();
                showcaseHighlightList.empty()
                for (var i = 0; i < AllShowcases.length; i++) {
                    AllShowcases[i].empty()
                    AllShowcasesCount[i] = 0
                }

                var app = "Splunk_Security_Essentials"; // ADJUSTED from dashboardcontroller to simplify
                if (showcasesByRole[roleName] == null) roleName = Options.getOptionByName('defaultRoleName');

                localStorage[localStoragePreface + '-role'] = RoleStorage.setRole(roleName);
                var myElements = document.getElementsByClassName("activeshowcase");
                for (var i = 0; i < myElements.length; i++) {
                    myElements[i].className = myElements[i].className.replace("activeshowcase", "");
                }
                if (typeof document.getElementById("showcase-" + roleName.replace(" ", "_")) != "undefined" && document.getElementById("showcase-" + roleName.replace(" ", "_")) != null) {
                    var element = document.getElementById("showcase-" + roleName.replace(" ", "_"))
                    document.getElementById("showcase-" + roleName.replace(" ", "_")).className = document.getElementById("showcase-" + roleName.replace(" ", "_")).className + " activeshowcase"
                }

                showcasesByRole[roleName].summaries.sort(function(a, b) {

                    if (showcaseSummaries[a].journey < showcaseSummaries[b].journey) return -1;
                    if (showcaseSummaries[a].journey > showcaseSummaries[b].journey) return 1;
                    if (showcaseSummaries[a].journey == showcaseSummaries[b].journey) {
                        if (showcaseSummaries[a].highlight > showcaseSummaries[b].highlight) return -1;
                        if (showcaseSummaries[a].highlight < showcaseSummaries[b].highlight) return 1;
                        if (showcaseSummaries[a].highlight == showcaseSummaries[b].highlight) {
                            if (showcaseSummaries[a].name.toLowerCase() < showcaseSummaries[b].name.toLowerCase()) return -1;
                            if (showcaseSummaries[a].name.toLowerCase() > showcaseSummaries[b].name.toLowerCase()) return 1;
                        }
                    }
                    //if (showcaseSummaries[a].name < showcaseSummaries[b].name) return -1;
                    //if (showcaseSummaries[a].name > showcaseSummaries[b].name) return 1;
                    return 0;
                })

                showcasesByRole[roleName].summaries.forEach(function(showcaseId) {

                    //var showcaseSettings = showcaseSummaries[showcaseId]; // testing changes to make the bookmarks automatically update
                    var showcaseSettings = window.ShowcaseInfo.summaries[showcaseId];

                    window.InScopeNames[showcaseSettings['name']] = false
                    if (typeof showcaseSettings.datasource == "undefined") {
                        showcaseSettings.datasource = "Other"
                        window.ShowcaseInfo.summaries[showcaseId].datasource = "Other"

                    }
                    var exampleText = void 0,
                        exampleList = void 0;
                    var InScope = true;

                    filters.forEach(function(filter) {
                        var myFilterArray = JSON.parse(localStorage[filter.localStorage + "-Multiple"])
                        showcaseSettings['class'] = "yesjourney" // Disabling the special journey filter functionality
                        if (filter.fieldName == "youcannotmatchmejourney") { // Disabling the special journey filter functionality
                            var meetsCriteria = true
                                //console.log("Checking criteria", showcaseSettings[filter.fieldName], showcaseSettings)
                            if (InScope == true && myFilterArray.indexOf("ALL") == -1 /*&& Category != filter.fieldName*/ ) {
                                meetsCriteria = false;
                                if (typeof showcaseSettings[filter.fieldName] != "undefined" && showcaseSettings[filter.fieldName] != null) {
                                    for (var i = 0; i < myFilterArray.length; i++) {
                                        var item = myFilterArray[i]
                                        if (typeof showcaseSettings[filter.fieldName] != "undefined" && showcaseSettings[filter.fieldName] != null && showcaseSettings[filter.fieldName].indexOf(item) >= 0) {
                                            meetsCriteria = true;
                                        }
                                    }
                                }
                            }
                            if (meetsCriteria == false) {
                                showcaseSettings['class'] = "nojourney"

                            } else {
                                showcaseSettings['class'] = "yesjourney"

                            }
                        } else {

                            //typeof localStorage[filter.localStorage] != "undefined" && localStorage[filter.localStorage] != null && 
                            switch (filter.type) {
                                case "exact":
                                    if (InScope == true && myFilterArray.indexOf("ALL") == -1 /* && Category != filter.fieldName*/ ) {
                                        InScope = false;

                                        if (typeof showcaseSettings[filter.fieldName] != "undefined" && showcaseSettings[filter.fieldName] != null && myFilterArray.indexOf(showcaseSettings[filter.fieldName].replace(/ /g, "_").replace(/\./g, "_")) >= 0) {
                                            InScope = true;
                                        } else if (typeof showcaseSettings[filter.fieldName] == "undefined" && myFilterArray.indexOf("None") >= 0) {
                                            InScope = true;
                                        }
                                    }
                                    break;
                                case "search":
                                    if (InScope == true && myFilterArray.indexOf("ALL") == -1 /*&& Category != filter.fieldName*/ ) {
                                        InScope = false;
                                        if (typeof showcaseSettings[filter.fieldName] != "undefined" && showcaseSettings[filter.fieldName] != null) {
                                            var ShowcaseItems = showcaseSettings[filter.fieldName].replace(/ /g, "_").replace(/\./g, "_").split("|")
                                            var ShowcaseItemsTwo = showcaseSettings[filter.fieldName].split("|")
                                            for (var i = 0; i < myFilterArray.length; i++) {
                                                var item = myFilterArray[i]

                                                if (typeof showcaseSettings[filter.fieldName] != "undefined" && showcaseSettings[filter.fieldName] != null && (ShowcaseItems.indexOf(item) >= 0 || ShowcaseItemsTwo.indexOf(item) >= 0)) {
                                                    InScope = true;
                                                }
                                            }

                                        }
                                    }
                                    break;
                                    /* case "count":
                                         if (typeof localStorage[filter.localStorage] != "undefined" && localStorage[filter.localStorage] != null && InScope == true && localStorage[filter.localStorage] != "ALL") {
                                             InScope = false;
                                             for (var q = 0; q < showcasesByRole[localStorage[filter.localStorage].replace(/_/g, " ")].summaries.length; q++) {
                                                 if (showcasesByRole[localStorage[filter.localStorage].replace(/_/g, " ")].summaries[q] == showcaseId) {
                                                     InScope = true;
                                                 }
                                             }
                                         }
                                         break;*/
                            }
                        }
                    });


                    if (InScope == false) {
                        return; // skip this one
                        window.InScopeNames[showcaseSettings['name']] = false
                    }
                    window.InScopeNames[showcaseSettings['name']] = true
                    var element = $(window.ShowcaseHTML[showcaseSettings['name']]).clone()

                    if (localStorage[localStoragePreface + "-highlight"] == "Yes" && localStorage[localStoragePreface + "-enabledFilters"].indexOf("highlight") >= 0)
                        element.removeClass("highlight")


                    if (typeof AllShowcases[showcaseSettings.journey.replace("Stage_", "")] != "undefined") { //JourneyAdjustment
                        var num = showcaseSettings.journey.replace("Stage_", "") //JourneyAdjustment
                        AllShowcases[num].append(element)
                        AllShowcasesCount[num]++
                    } else {
                        AllShowcases[AllShowcases.length - 1].append(element)
                        AllShowcasesCount[AllShowcases.length - 1]++
                    }

                    if (showcaseHighlightList.children().length > 0) {
                        $(".showcase-highlight").css("display", "block")
                    } else {
                        $(".showcase-highlight").css("display", "none")
                    }

                });
                // Hide the stages that aren't in scope
                var maxJourney = 0
                for (var i = 1; i < AllShowcases.length - 1; i++) { // With -1 for the length, we are excluding "Other"
                    if (localStorage[localStoragePreface + '-journey-Multiple'].indexOf("Stage_" + i) == -1) { //JourneyAdjustment
                        $("#useCasesStage" + i).hide()
                    } else {
                        $("#useCasesStage" + i).show()
                        maxJourney = i
                    }
                }

                if (maxJourney < JourneyStageIds.length) { //NumJourneys
                    var link = $('<a href="#">Show Next Stage: ' + JourneyStageNames[maxJourney + 1] + '</a>').click(function() {
                        setJourneyStage(maxJourney + 1, true);
                        setTimeout(function() {
                            $("#useCasesStage" + (maxJourney + 1)).scroll()
                        }, ((maxJourney + 1) * 100 + 500));
                        return false;
                    })
                    if (document.getElementById('NextStageLink') == null)
                        $('#mainDisplay').append($('<h3 id="NextStageLink"></h3>').append(link))
                    else
                        $('#NextStageLink').html(link)
                } else {
                    $('#NextStageLink').remove()
                }
                $(".contentstile").find("h3").each(function(a, b) { if ($(b).height() > 60) { $(b).text($(b).text().replace(/^(.{55}).*/, "$1...")) } })
            };

            DashboardController.onReady(function() {
                DashboardController.onViewModelLoad(function() {
                    $('#mainDisplay').html('<div id="displayGrayOut" style="display: none; position:absolute; z-index: 2; top:0; left:0; bottom:0; right:0; background:rgba(0,0,0,.5);"></div>')

                    for (var i = 1; i < AllShowcases.length - 1; i++) {
                        $('#mainDisplay').append($("<div class=\"useCaseStage\" id=\"useCasesStage" + i + "\">").append($("<h2 style=\"padding-bottom: 0; margin-bottom: 0;\">Stage " + i + ": " + JourneyStageNames[i] + " <a class=\"external drilldown-link\" style=\"font-size:1em\" href=\"journey?stage=" + i + "\" target=\"_blank\"></a></h2><p style=\"color: #646464; font-size:9pt\">" + JourneyStageDescriptions[i] + "</p>"), /* Disabling the inline journey because I don't like it... adds Complexity. // Dropdown, content,*/ AllShowcases[i], $("<hr class=\"showcase-highlight\" />")))

                    }
                    initNav();
                    setUpNav();


                });
            });
            $(".dvPopover").popover()
            setTimeout(function() { $(".dvPopover").popover() }, 1500);

            var resetNav = function(doBasic) {
                //$("#searchbarDiv").hide()
                $("#hiddenValues").html("")
                allFilters.forEach(function(filter) {
                    localStorage[filter.localStorage] = "ALL"
                    if (filter.fieldName == "journey") {
                        localStorage[filter.localStorage + "-Multiple"] = JSON.stringify(JourneyStageIds) // NumJourneys
                    } else {
                        localStorage[filter.localStorage + "-Multiple"] = JSON.stringify(["ALL"])
                    }
                });
                if (doBasic == true) {
                    localStorage[localStoragePreface + "-enabledFilters"] = JSON.stringify(["journey", "usecase", "category", "datasource", "highlight"])
                    localStorage[localStoragePreface + "-highlight"] = "Yes"
                    localStorage[localStoragePreface + "-highlight-Multiple"] = "[\"Yes\"]"
                    setJourneyStage(1, false)
                } else {
                    setJourneyStage(6, false)
                }

                UpdateFilters(JSON.parse(localStorage[localStoragePreface + "-enabledFilters"]))

            }
            window.resetNav = resetNav



            function initNav() {

                if (typeof localStorage[localStoragePreface + '-newUserRun'] == "undefined") {
                    localStorage[localStoragePreface + '-newUserRun'] = "New"
                    localStorage[localStoragePreface + '-highlight'] = "Yes"
                    localStorage[localStoragePreface + '-showfilters'] = "false"
                    localStorage[localStoragePreface + '-highlight-Multiple'] = JSON.stringify(["Yes"])
                    localStorage[localStoragePreface + "-enabledFilters"] = JSON.stringify(["journey", "usecase", "category", "datasource", "highlight"])
                    setJourneyStage("1");
                }

                allFilters.forEach(function(filter) {
                    if (typeof localStorage[filter.localStorage] == "undefined" || localStorage[filter.localStorage] == null) {
                        localStorage[filter.localStorage] = "ALL"
                    }
                    if (typeof localStorage[filter.localStorage + "-Multiple"] == "undefined" || localStorage[filter.localStorage + "-Multiple"] == null) {
                        if (filter.fieldName == "journey") {
                            localStorage[filter.localStorage + "-Multiple"] = JSON.stringify(["Stage_1"])
                        } else {
                            localStorage[filter.localStorage + "-Multiple"] = JSON.stringify(["ALL"])
                        }

                    }
                });

                if (typeof localStorage[localStoragePreface + "-enabledFilters"] == "undefined" || localStorage[localStoragePreface + "-enabledFilters"].indexOf("journey") < 0) {
                    localStorage[localStoragePreface + "-enabledFilters"] = JSON.stringify(["journey", "usecase", "category", "datasource"])
                    UpdateFilters(JSON.parse(localStorage[localStoragePreface + "-enabledFilters"]))
                } else {
                    UpdateFilters(JSON.parse(localStorage[localStoragePreface + "-enabledFilters"]))
                }
            }

            function setJourneyStage(journeyStageAsString, triggerNewNav) { // built into a separate function because I kept on screwing it up...

                var stages = []
                for (var i = 1; i <= parseInt(journeyStageAsString); i++) {
                    stages.push("Stage_" + i)
                }
                localStorage[localStoragePreface + "-journey-Multiple"] = JSON.stringify(stages)
                localStorage[localStoragePreface + "-journey"] = "Stage_" + journeyStageAsString
                if (triggerNewNav == true)
                    setUpNav()
            }

            function setUpNav() {

                var myHTML = ""
                var myFilterHTML = new Object;
                var myFilters = new Array(filters.length);
                filters.forEach(function(filter) {
                    var tooltipText = ""
                    if (typeof filter.tooltip != "undefined")
                        tooltipText = "&nbsp;<span style=\"right: -100px; top: -10px\" class=\"tooltiptext tooltiptextright\">" + filter.tooltip + "</span>"

                    var filterStyle = "width: " + filter.width
                    myFilterHTML[filter.fieldName] = "<div style=\"" + filterStyle + "\" class=\"ssecolumn\"><div class=\"tooltipcontainer ssecolumnlabel\" style=\"font-weight: bolder; width: " + filter.width + "\">" + filter.displayName + tooltipText + "</div>";
                    myFilters[filter.sortOrder] = new Object();
                });


                var showcase = "default";


                // Calculate the max number of use cases
                for (var i = 0; i < showcasesByRole[showcase].summaries.length; i++) {
                    var myShowcase = window.ShowcaseInfo.summaries[showcasesByRole[showcase].summaries[i]]
                    var showcaseLabel = showcasesByRole[showcase].summaries[i]
                        //console.log("Processing", myShowcase, showcasesByRole[showcase].summaries[i])

                    filters.forEach(function(filter) {
                        switch (filter.type) {
                            case "exact":
                                if (typeof myShowcase[filter.fieldName] != "undefined") {
                                    if (typeof myFilters[filter.sortOrder][myShowcase[filter.fieldName]] == "undefined")
                                        myFilters[filter.sortOrder][myShowcase[filter.fieldName]] = 0;
                                    myFilters[filter.sortOrder][myShowcase[filter.fieldName]]++;
                                } else {
                                    if (typeof myFilters[filter.sortOrder]["None"] == "undefined")
                                        myFilters[filter.sortOrder]["None"] = 0;
                                    myFilters[filter.sortOrder]["None"]++;
                                }
                                //console.log(myFilters[filter.sortOrder]);
                                break;
                            case "search":
                                if (typeof myShowcase[filter.fieldName] != "undefined") {
                                    if (myShowcase[filter.fieldName].indexOf("|") >= 0) {
                                        var list = myShowcase[filter.fieldName].split("|")
                                        for (var g = 0; g < list.length; g++) {
                                            if (typeof myFilters[filter.sortOrder][list[g]] == "undefined")
                                                myFilters[filter.sortOrder][list[g]] = 0;
                                            myFilters[filter.sortOrder][list[g]]++;
                                        }
                                    } else {
                                        if (typeof myFilters[filter.sortOrder][myShowcase[filter.fieldName]] == "undefined")
                                            myFilters[filter.sortOrder][myShowcase[filter.fieldName]] = 0;
                                        myFilters[filter.sortOrder][myShowcase[filter.fieldName]]++;
                                    }
                                } else {
                                    if (typeof myFilters[filter.sortOrder]["None"] == "undefined")
                                        myFilters[filter.sortOrder]["None"] = 0;
                                    myFilters[filter.sortOrder]["None"]++;
                                }
                                //console.log(myFilters[filter.sortOrder]);
                                break;
                        }
                    });

                }


                var myInScopeFilters = new Array(filters.length);
                filters.forEach(function(filter) {
                    myInScopeFilters[filter.sortOrder] = new Object();
                });

                var InScopeIDs = DetermineInScope()

                InScopeIDs.forEach(function(showcaseId) {
                    var showcaseSettings = showcaseSummaries[showcaseId];
                    var exampleText = void 0,
                        exampleList = void 0;
                    var InScope = true;


                    filters.forEach(function(filter) {

                        switch (filter.type) {
                            case "exact":
                                if (typeof showcaseSettings[filter.fieldName] != "undefined") {
                                    if (typeof myInScopeFilters[filter.sortOrder][showcaseSettings[filter.fieldName]] == "undefined")
                                        myInScopeFilters[filter.sortOrder][showcaseSettings[filter.fieldName]] = 0;
                                    myInScopeFilters[filter.sortOrder][showcaseSettings[filter.fieldName]]++;
                                } else {
                                    if (typeof myInScopeFilters[filter.sortOrder]["None"] == "undefined")
                                        myInScopeFilters[filter.sortOrder]["None"] = 0;
                                    myInScopeFilters[filter.sortOrder]["None"]++;
                                }
                                break;
                            case "search":
                                if (typeof showcaseSettings[filter.fieldName] != "undefined") {
                                    if (showcaseSettings[filter.fieldName].indexOf("|") >= 0) {
                                        var list = showcaseSettings[filter.fieldName].split("|")
                                        for (var g = 0; g < list.length; g++) {
                                            // console.log("Doing analysis for", showcaseId, "analyzing", filter.fieldName, list, "looking for ", list[g], "in", myInScopeFilters[filter.sortOrder], "result: ", myInScopeFilters[filter.sortOrder][list[g]] )
                                            if (typeof myInScopeFilters[filter.sortOrder][list[g]] == "undefined" || isNaN(myInScopeFilters[filter.sortOrder][list[g]]))
                                                myInScopeFilters[filter.sortOrder][list[g]] = 1;
                                            else
                                                myInScopeFilters[filter.sortOrder][list[g]]++;
                                        }
                                    } else {
                                        if (showcaseSettings[filter.fieldName])
                                            if (typeof myInScopeFilters[filter.sortOrder][showcaseSettings[filter.fieldName]] == "undefined")
                                                myInScopeFilters[filter.sortOrder][showcaseSettings[filter.fieldName]] = 1;
                                            else
                                                myInScopeFilters[filter.sortOrder][showcaseSettings[filter.fieldName]]++;
                                    }
                                } else {
                                    if (typeof myInScopeFilters[filter.sortOrder]["None"] == "undefined")
                                        myInScopeFilters[filter.sortOrder]["None"] = 0;
                                    myInScopeFilters[filter.sortOrder]["None"]++;
                                }
                                break;
                        }
                    });

                });

                filters.forEach(function(filter) {
                    var chosenOptions = JSON.parse(localStorage[filter.localStorage + "-Multiple"])
                    var filterStyle = "width: " + filter.width

                    if (typeof filter.container == "undefined") {
                        var ulStyle = filterStyle
                        var selected = ""
                        if (chosenOptions.indexOf("ALL") >= 0)
                            selected = " selected"
                        myFilterHTML[filter.fieldName] += "<select id=\"multiselect" + filter.fieldName + "\" multiple=\"multiple\">"
                        if (filter.fieldName != "journey") {
                            myFilterHTML[filter.fieldName] += "<option name=\"" + filter.localStorage.split(localStoragePreface + '-')[1] + "\" id=\"" + filter.localStorage.split(localStoragePreface + '-')[1] + "_ALL\" value=\"ALL\" " + selected + ">All</option>";
                        }
                    }
                    var element = ""

                    if (typeof filter.itemSort != "undefined") {
                        var mySorted = []
                        var unSorted = ""
                        for (var i = 0; i < filter.itemSort.length; i++) {
                            mySorted[i] = ""
                        }
                        for (var i = 0; i < Object.keys(myFilters[filter.sortOrder]).length; i++) {
                            var item = Object.keys(myFilters[filter.sortOrder]).sort()[i]
                            var tooltipText = ""
                            var selected = ""
                            if (chosenOptions.indexOf(item.replace(" Domain", "").replace(/ /g, "_").replace(/\./g, "_")) >= 0)
                                selected = " selected"
                            var itemHTML = ""

                            //myFilterHTML[filter.fieldName] += '<option id="' + filter.localStorage.split(localStoragePreface + '-')[1] + '_' + item.replace(/ /g, "_").replace(/\./g, "_") + '" name="' + filter.localStorage.split(localStoragePreface + '-')[1] + '" value="' + item.replace(/ /g, "_").replace(/\./g, "_") + '" ' + selected + '>' + item.replace(" Domain", "").replace("Stage_", "Stage ") + ' (' + (GetNumberInScope(filter.fieldName, item, InScopeIDs) /*myInScopeDomains[item]*/ || "0") + "/" + myFilters[filter.sortOrder][item] + ')</option>';
                            var NumberMatch = GetNumberInScope(filter.fieldName, item, InScopeIDs)
                            var myclass = ""
                            if (NumberMatch == 0) {
                                myclass = "class=\"darkMenuElement\" "
                            }
                            var label = item.replace(" Domain", "")
                            if (typeof filter.manipulateDisplay != "undefined") {
                                label = filter.manipulateDisplay(label)
                            }
                            //manipulateDisplay
                            itemHTML += '<option ' + myclass + 'id="' + filter.localStorage.split(localStoragePreface + '-')[1] + '_' + item.replace(/ /g, "_").replace(/\./g, "_") + '" name="' + filter.localStorage.split(localStoragePreface + '-')[1] + '" value="' + item.replace(/ /g, "_").replace(/\./g, "_") + '" ' + selected + '>' + label + ' (' + (NumberMatch || "0") + ' matches)</option>';


                            if (filter.itemSort.indexOf(item) >= 0) {
                                mySorted[filter.itemSort.indexOf(item)] = itemHTML

                            } else {
                                unSorted += itemHTML
                            }
                        }
                        element += mySorted.join("\n") + unSorted


                    } else {
                        for (var i = 0; i < Object.keys(myFilters[filter.sortOrder]).length; i++) {
                            var item = Object.keys(myFilters[filter.sortOrder]).sort()[i]
                            var selected = ""
                            if (chosenOptions.indexOf(item.replace(" Domain", "").replace(/ /g, "_").replace(/\./g, "_")) >= 0)
                                selected = " selected"
                            var NumberMatch = GetNumberInScope(filter.fieldName, item, InScopeIDs)
                            var myclass = ""
                            if (NumberMatch == 0)
                                myclass = "class=\"darkMenuElement\" "

                            myFilterHTML[filter.fieldName] += '<option ' + myclass + 'id="' + filter.localStorage.split(localStoragePreface + '-')[1] + '_' + item.replace(/ /g, "_").replace(/\./g, "_") + '" name="' + filter.localStorage.split(localStoragePreface + '-')[1] + '" value="' + item.replace(/ /g, "_").replace(/\./g, "_") + '" ' + selected + '>' + item.replace(" Domain", "").replace("Stage_", "Stage ") + ' (' + (NumberMatch /*myInScopeDomains[item]*/ || "0") + " matches)</option>";

                        }
                    }

                    if (typeof filter.container == "undefined") {
                        myFilterHTML[filter.fieldName] += element + "</select></div>"
                    } else {
                        $(filter.container).html(element)
                    }
                });
                // console.log("Hey! I got my new content!", myFilterHTML)

                myHTML = ""
                for (var item in myFilterHTML) {
                    myHTML += myFilterHTML[item]
                }
                $('#rolePickerControl').html(myHTML);
                var myLink = $('#resetFilterLink').find("a").first().click(function() {
                    resetNav();
                    return false;
                })
                var myLink = $('#defaultFilterLink').find("a").first().click(function() {
                    resetNav(true);
                    return false;
                })

                $('#selectFilterLink').find("a").first().unbind("click");
                $('#selectFilterLink').find("a").first().click(function() {
                    ChangeFilters();
                    return false;
                })
                filters.forEach(function(filter) {
                    //console.log("Setting up multiselect for ", filter)
                    if (filter.fieldName != "journey") {
                        $("#multiselect" + filter.fieldName).multiselect({
                            onChange: function(element, checked) {
                                //console.log("Change for", element, $(element), $(element).attr("name"), $(element).attr("value"), checked)
                                if (typeof window.DoNotPopulate[$(element).attr("name") + "-" + $(element).attr("value")] != "undefined") {
                                    delete window.DoNotPopulate[$(element).attr("name") + "-" + $(element).attr("value")]
                                        //  console.log("I am not propagating", element, $(element), $(element).attr("name"), $(element).attr("value"), checked)
                                } else {
                                    if ($(element).attr("value") == "ALL" && checked == "true") {
                                        doChange(element, checked, true);
                                    } else {
                                        doChange(element, checked, false);
                                        // console.log("Checking callback length for ", $(element).attr("name"))

                                        if (window.filterCallBack[$(element).attr("name")].length == 0) {
                                            window.filterCallBack[$(element).attr("name")].push(function() {

                                                //$("#searchbarDiv").hide()
                                                $("#hiddenValues").html("")
                                                setRole()
                                                setUpNav()
                                            })
                                        }

                                    }
                                }

                            },
                            onDropdownHide: function(event) {
                                var id = $(event.target).parent().find("select").first().attr("id").replace("multiselect", "")

                                if (typeof window.filterCallBack != "undefined" && typeof window.filterCallBack[id] != "undefined" && window.filterCallBack[id].length > 0) {
                                    //          console.log("Attempting a callback!")
                                    var myFunc = window.filterCallBack[id].shift()
                                    myFunc()
                                }

                                $("#displayGrayOut").css("display", "none")
                            },
                            buttonWidth: filter.width
                        })


                    } else {
                        $('#multiselectjourney').multiselect({
                            onChange: function(element, checked) {
                                //      console.log("Change for", element, $(element), $(element).attr("name"), $(element).attr("value"), checked)
                                if (checked == true) {
                                    setJourneyStage($(element).attr("value").replace("Stage_", ""), true)
                                } else {


                                    // Hide the stages that aren't in scope
                                    var maxJourney = 0
                                    for (var i = 1; i < AllShowcases.length - 1; i++) { // With -1 for the length, we are excluding "Other"
                                        if (localStorage[localStoragePreface + '-journey-Multiple'].indexOf("Stage_" + i) == -1) { //JourneyAdjustment
                                            $("#useCasesStage" + i).hide()
                                        } else {
                                            $("#useCasesStage" + i).show()
                                            maxJourney = i
                                        }
                                    }

                                    if ($(element).attr("value") == "Stage_1") {
                                        setJourneyStage(1, true)
                                    } else if (parseInt($(element).attr("value").replace("Stage_", "")) < parseInt(maxJourney)) {
                                        setJourneyStage($(element).attr("value").replace("Stage_", ""), true)
                                    } else {
                                        var newStage = parseInt($(element).attr("value").replace("Stage_", "")) - 1
                                        setJourneyStage(newStage, true)
                                    }

                                }


                                //doChange(element, checked)
                            },
                            buttonWidth: filter.width
                        });
                    }



                })
                $(".dropdown-toggle").removeClass("dropdown-toggle")
                $("#rolePickerControl").css("text-align", "left").css("width", "100%")


                $("#FiltersBox").css("margin-top", "10px")
                $("#FiltersBox").css("margin-bottom", "10px")
                var role = "default"

                filters.forEach(function(filter) {
                    domain = filter.localStorage.split(localStoragePreface + "-")[1]
                    var myArray = JSON.parse(localStorage[filter.localStorage + "-Multiple"])
                    for (var i = 0; i < myArray.length; i++) {
                        $("#" + domain + "_" + myArray[i]).attr("checked", true)
                    }

                });

                setRole(role)

                Object.keys(AllFilterFields).forEach(function(filterName) {
                    if (typeof SelectedFilterFields[filterName] == "undefined" && filterName != "highlight") {
                        $("." + filterName + "Elements").hide()
                    } else {}
                })

                function doChange(object, checked, triggerRefresh) {

                    var name = $(object).attr("name")
                    var value = $(object).attr("value")
                    var localfilters = JSON.parse(localStorage[localStoragePreface + "-enabledFilters"])
                    Telemetry.SendTelemetryToSplunk("FiltersChanged", { "name": name, "value": value, "status": checked, "enabledFilters": localfilters })

                    localStorage[localStoragePreface + "-" + $(object).attr("name")] = $(object).attr("value")

                    if (checked == true) {
                        var myArray = JSON.parse(localStorage[localStoragePreface + "-" + $(object).attr("name") + "-Multiple"])
                        if ($(object).attr("value") == "ALL") {
                            myArray = ["ALL"]
                            $("#multiselect" + $(object).attr("name")).parent().find("li.active").find("input").each(function(num, obj) {
                                if (obj.value != "ALL") {
                                    $("#multiselect" + $(object).attr("name")).parent().find("option[value='" + obj.value + "']").removeAttr("selected")
                                    $("#multiselect" + $(object).attr("name")).multiselect("refresh")
                                    $("#displayGrayOut").css("display", "block")


                                }
                            })
                        } else {
                            if (myArray.indexOf("ALL") >= 0) {
                                myArray = [$(object).attr("value")]
                                $("#multiselect" + $(object).attr("name")).parent().find("option[value='ALL']").removeAttr("selected")
                                $("#multiselect" + $(object).attr("name")).multiselect("refresh")
                                $("#displayGrayOut").css("display", "block")
                            } else {
                                myArray.push($(object).attr("value"))
                            }
                        }

                        localStorage[localStoragePreface + "-" + $(object).attr("name") + "-Multiple"] = JSON.stringify(myArray)
                    } else {
                        var myArray = JSON.parse(localStorage[localStoragePreface + "-" + $(object).attr("name") + "-Multiple"])

                        if ($(object).attr("value") == "ALL") {
                            myArray = ["ALL"]
                                //window.DoNotPopulate[$(object).attr("name") + "-" + $(object).attr("value")] = 1
                                //$("#multiselect" + $(object).attr("name")).parent().find("input[value='ALL']").click()
                            $("#multiselect" + $(object).attr("name")).parent().find("option[value='ALL']").attr("selected", "selected")
                            $("#multiselect" + $(object).attr("name")).multiselect("refresh")
                            $("#displayGrayOut").css("display", "block")
                        } else {
                            var myIndex = myArray.indexOf($(object).attr("value"))
                            if (myIndex >= 0) {
                                myArray.splice(myIndex, 1)
                            }
                            if (myArray.length == 0 && $(object).attr("name") != "journey") {
                                myArray = ["ALL"]
                                    //window.DoNotPopulate[$(object).attr("name") + "-" + $(object).attr("value")] = 1
                                    //$("#multiselect" + $(object).attr("name")).parent().find("input[value='ALL']").click()
                                $("#multiselect" + $(object).attr("name")).parent().find("option[value='ALL']").attr("selected", "selected")
                                $("#multiselect" + $(object).attr("name")).multiselect("refresh")
                                $("#displayGrayOut").css("display", "block")
                            }
                        }

                        localStorage[localStoragePreface + "-" + $(object).attr("name") + "-Multiple"] = JSON.stringify(myArray)

                    }
                    //     console.log("Here's the new selection:", localStorage[localStoragePreface + "-" + $(object).attr("name") + "-Multiple"])
                    if (typeof triggerRefresh == "undefined" || triggerRefresh == true) {

                        setRole()
                        setUpNav()

                    }
                }
                window.doChange = doChange
                window.setRole = setRole
                window.setUpNav = setUpNav


                // console.log("Got an update", $(".showcaseItemTile").length, $("#filterNum").text($(".showcaseItemTile").length));

            }

            function DetermineInScope(Category) {
                var FilterString = ""
                filters.forEach(function(a) {
                    FilterString += localStorage[a.localStorage + "-Multiple"]
                })
                if (typeof window.InScopeHash[Category] == "undefined") {
                    window.InScopeHash[Category] = new Object()
                    window.InScopeHash[Category]['filters'] = ""
                    window.InScopeHash[Category]['inScope'] = ""
                } else if (window.InScopeHash[Category]['filters'] == FilterString) {
                    return window.InScopeHash[Category]['inScope']
                }
                //console.log("Recomputing the in scope..")
                var inScopeIds = []
                window.summaryCount_total = 0
                window.summaryCount_InScope = 0
                window.summaryCount_InScope_InJourney = 0
                showcasesByRole["default"].summaries.forEach(function(showcaseId) {
                    window.summaryCount_total++;
                    var showcaseSettings = showcaseSummaries[showcaseId];
                    var exampleText = void 0,
                        exampleList = void 0;
                    var InScope = true;

                    filters.forEach(function(filter) {
                        var myFilterArray = JSON.parse(localStorage[filter.localStorage + "-Multiple"])

                        if (filter.fieldName == "journeyblahblah") {
                            var meetsCriteria = true
                            if (InScope == true && myFilterArray.indexOf("ALL") == -1 /*&& Category != filter.fieldName*/ ) {
                                meetsCriteria = false;
                                if (typeof showcaseSettings[filter.fieldName] != "undefined" && showcaseSettings[filter.fieldName] != null) {
                                    for (var i = 0; i < myFilterArray.length; i++) {
                                        var item = myFilterArray[i]
                                        if (typeof showcaseSettings[filter.fieldName] != "undefined" && showcaseSettings[filter.fieldName] != null && showcaseSettings[filter.fieldName].indexOf(item) >= 0) {
                                            meetsCriteria = true;
                                        }
                                    }
                                }
                            }
                            return true;
                        }

                        switch (filter.type) {
                            case "exact":
                                if (InScope == true && myFilterArray.indexOf("ALL") == -1 && Category != filter.fieldName) {
                                    InScope = false;

                                    if (typeof showcaseSettings[filter.fieldName] != "undefined" && showcaseSettings[filter.fieldName] != null && myFilterArray.indexOf(showcaseSettings[filter.fieldName].replace(/ /g, "_").replace(/\./g, "_")) >= 0) {
                                        InScope = true;
                                    } else if (typeof showcaseSettings[filter.fieldName] == "undefined" && myFilterArray.indexOf("None") >= 0) {
                                        InScope = true;
                                    }
                                }
                                break;
                            case "search":
                                if (InScope == true && myFilterArray.indexOf("ALL") == -1 && Category != filter.fieldName) {
                                    InScope = false;
                                    if (typeof showcaseSettings[filter.fieldName] != "undefined" && showcaseSettings[filter.fieldName] != null) {
                                        for (var i = 0; i < myFilterArray.length; i++) {
                                            var item = myFilterArray[i]
                                            var ShowcaseItems = showcaseSettings[filter.fieldName].replace(/ /g, "_").split("|")
                                            var ShowcaseItemsTwo = showcaseSettings[filter.fieldName].split("|")
                                            if (typeof showcaseSettings[filter.fieldName] != "undefined" && showcaseSettings[filter.fieldName] != null && (ShowcaseItems.indexOf(item) >= 0 || ShowcaseItemsTwo.indexOf(item) >= 0)) {
                                                InScope = true;
                                            }
                                        }

                                    }
                                }
                                break;
                                /*case "count":
                                    if (typeof localStorage[filter.localStorage] != "undefined" && localStorage[filter.localStorage] != null && InScope == true && localStorage[filter.localStorage] != "ALL" && Category != filter.fieldName) {
                                        InScope = false;
                                        for (var q = 0; q < showcasesByRole[localStorage[filter.localStorage].replace(/_/g, " ")].summaries.length; q++) {
                                            if (showcasesByRole[localStorage[filter.localStorage].replace(/_/g, " ")].summaries[q] == showcaseId) {
                                                InScope = true;
                                            }
                                        }
                                    }
                                    break;*/
                        }

                        window.HowManyInScopeChecks++;
                    });

                    if (InScope == true) {
                        inScopeIds.push(showcaseId)
                        window.summaryCount_InScope++;

                        if (localStorage[localStoragePreface + '-enabledFilters'].indexOf("highlight") == -1 || localStorage[localStoragePreface + '-highlight'] == 'ALL' || localStorage[localStoragePreface + '-highlight-Multiple'].indexOf(window.ShowcaseInfo.summaries[showcaseId].highlight) != -1) {
                            summaryCount_InScope_InJourney++ //I literally have no idea why I have to go to these grand levels for highlights, but I'm tired and I'm cheating. Core problem: "recommended" filter wasn't taken into effect in the count. 
                        }
                    }

                })
                window.InScopeHash[Category]['inScope'] = inScopeIds
                window.InScopeHash[Category]['filters'] = FilterString
                $("#totalNum").html(summaryCount_total)
                $("#analyticCount").html(summaryCount_total)
                $("#filterNum").html(summaryCount_InScope_InJourney)

                return inScopeIds
            }


            function GetNumberInScope(Category, Item, InScopeIDs) {
                // Calculate the in scope number of use cases. This is the (5/17) number that shows up in the menu.


                var myInScopeFilters = new Array(filters.length)
                filters.forEach(function(filter) {
                    myInScopeFilters[filter.sortOrder] = new Object();
                });

                var InScopeIDs = DetermineInScope(Category) // <<<<<<<------ if you don't see an obvious problem in this function, the next step is this line

                //console.log("Final In Scope IDs", InScopeIDs) 
                //showcasesByRole["default"].summaries.forEach(function (showcaseId) {
                InScopeIDs.forEach(function(showcaseId) {
                    var showcaseSettings = showcaseSummaries[showcaseId];

                    var exampleText = void 0,
                        exampleList = void 0;
                    var InScope = true;
                    //console.log("We're in scope for ", showcaseId, " with ", showcaseSettings.released, " and", showcaseSettings)
                    //var myShowcase = ShowcaseInfo.summaries[showcasesByRole[showcase].summaries[i]]
                    //var showcaseLabel=showcasesByRole[showcase].summaries[i]

                    filters.forEach(function(filter) {

                        /*if(filter.fieldName == "journey"){
                            return true;
                        }*/ // Disabling the special journey filter functionality
                        switch (filter.type) {
                            case "exact":
                                if (Category == filter.fieldName) {

                                    if (typeof showcaseSettings[filter.fieldName] != "undefined") {

                                        var newReleased = showcaseSettings[filter.fieldName].replace(/ /g, "_").replace(/\./g, "_")

                                        if (typeof myInScopeFilters[filter.sortOrder][newReleased] == "undefined")
                                            myInScopeFilters[filter.sortOrder][newReleased] = 0;
                                        myInScopeFilters[filter.sortOrder][newReleased]++;

                                    } else {
                                        if (typeof myInScopeFilters[filter.sortOrder]["None"] == "undefined")
                                            myInScopeFilters[filter.sortOrder]["None"] = 0;
                                        myInScopeFilters[filter.sortOrder]["None"]++;
                                    }
                                }
                                break;
                            case "search":

                                if (Category == filter.fieldName) {
                                    if (typeof showcaseSettings[filter.fieldName] != "undefined") {
                                        if (showcaseSettings[filter.fieldName].indexOf("|") >= 0) {
                                            var list = showcaseSettings[filter.fieldName].split("|")
                                            for (var g = 0; g < list.length; g++) {
                                                if (typeof myInScopeFilters[filter.sortOrder][list[g]] == "undefined")
                                                    myInScopeFilters[filter.sortOrder][list[g]] = 0;
                                                myInScopeFilters[filter.sortOrder][list[g]]++;
                                                //console.log("Checking", showcaseSettings.datasource, showcaseId)

                                            }
                                        } else {
                                            if (showcaseSettings[filter.fieldName])
                                                if (typeof myInScopeFilters[filter.sortOrder][showcaseSettings[filter.fieldName]] == "undefined")
                                                    myInScopeFilters[filter.sortOrder][showcaseSettings[filter.fieldName]] = 0;
                                            myInScopeFilters[filter.sortOrder][showcaseSettings[filter.fieldName]]++;
                                            //  console.log("Checking", showcaseSettings.datasource, showcaseId)
                                        }
                                    }
                                } else {
                                    if (typeof myInScopeFilters[filter.sortOrder]["None"] == "undefined")
                                        myInScopeFilters[filter.sortOrder]["None"] = 0;
                                    myInScopeFilters[filter.sortOrder]["None"]++;
                                }
                                break;
                                /*case "count":
                                    if (Category == filter.fieldName) {
                                        Object.keys(showcasesByRole).map(function (showcase) {
                                            if (showcase != "default") {
                                                for (var i = 0; i < showcasesByRole[showcase].summaries.length; i++) {

                                                    if (showcaseId == showcasesByRole[showcase].summaries[i]) {
                                                        
                                                        if (typeof myInScopeFilters[filter.sortOrder][showcase] == "undefined")
                                                            myInScopeFilters[filter.sortOrder][showcase] = 0;
                                                        myInScopeFilters[filter.sortOrder][showcase]++

                                                    }
                                                }
                                            }
                                        })
                                    }
                                    break;*/
                        }

                    });

                });

                var _filteredFilter = filters.filter(function(a) {
                    return a.fieldName == Category
                });
                return myInScopeFilters[_filteredFilter[0].sortOrder][Item] || "0";


            }
            $("#dvPopover").popover()


            initModal()
        })

        function toggleFilters() {
            if ($("#FiltersBox").css("display") != "none") {
                $("#FiltersBox").css("display", "none")
                $("#toggleFilters").text(" (Show)")
                    //$("#hamburgerContainer").hide()
                localStorage[localStoragePreface + '-showfilters'] = "false"
            } else {
                $("#FiltersBox").css("display", "block")
                $("#toggleFilters").text(" (Hide)")
                    //$("#hamburgerContainer").show()
                localStorage[localStoragePreface + '-showfilters'] = "true"
            }
        }

        function DownloadAllUseCases() {
            var myDownload = []
            var myCSV = ""
                // console.log("here's my download", myDownload)
            var myHeader = ["Name", "Description"]
            for (var filterCount = 0; filterCount < allFilters.length; filterCount++) {
                if (typeof allFilters[filterCount].export != "undefined" && allFilters[filterCount].export == "yes")
                    myHeader.push(allFilters[filterCount].displayName)

            }
            myDownload.push(myHeader)
            myCSV += myHeader.join(",") + "\n"
            for (var i = 0; i < ShowcaseInfo.roles.default.summaries.length; i++) {
                var row = ['"' + ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]]['name'].replace(/"/g, '""') + '"', '"' + ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]]['description'].replace(/"/g, '""') + '"']
                for (var filterCount = 0; filterCount < allFilters.length; filterCount++) {
                    if (typeof allFilters[filterCount].export != "undefined" && allFilters[filterCount].export == "yes") {
                        var line = ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]][allFilters[filterCount].fieldName] || "";
                        if (allFilters[filterCount].type == "search")
                            line = line.replace(/\|/g, ", ")
                        if (typeof allFilters[filterCount].manipulateDisplay != "undefined")
                            line = allFilters[filterCount].manipulateDisplay(line)

                        row.push('"' + line.replace(/"/g, '""') + '"')
                    }
                }
                myDownload.push(row)
                myCSV += row.join(",") + "\n"
            }
            // console.log("here's my download", myDownload)
            var filename = "Splunk_Security_Use_Cases.csv"

            var blob = new Blob([myCSV], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        }

        //$("#downloadUseCaseIcon").click(function() { DownloadAllUseCases(); return false; })
        $("#bookmarkAllIcon").click(function() {
            $("img.bookmarkIcon").click();
            return false;
        })
        $("#unbookmarkAllIcon").click(function() {
                $("li").find("i.icon-bookmark").click()
                return false;
            })
            // 7.2 $(".dashboard-export-container").html($('<a class="btn" style="margin-right: 4px;" href="#" >CSV <i class="icon-export" /></a>').click(function(){DownloadAllUseCases(); return false;}))
        $(".edit-export").remove()
        $(".dashboard-export-container").remove()

        $(".dashboard-view-controls").prepend($('<a class="btn" style="margin-right: 4px;" href="#" >CSV <i class="icon-export" /></a>').click(function() { DownloadAllUseCases(); return false; }))
        $(".dashboard-view-controls").prepend('<a class="btn" style="margin-right: 3px;" href="bookmarked_content" >' + _("Manage Bookmarks").t() + ' <i class="icon-bookmark" /></a>')

        var currentVersion = "2.4";
        $(".dashboard-view-controls").prepend($('<button class="btn" id="whatsnewbutton" style="margin-right: 3px;" href="#" >What\'s New In ' + currentVersion + '?</button>').click(function() {

            require(['app/Splunk_Security_Essentials/components/controls/Modal'], function(Modal) {

                var newModal = new Modal('modalNewIn' + currentVersion, {
                    title: 'What\'s New in SSE ' + currentVersion + '?',
                    destroyOnHide: true,
                    type: 'wide'
                });


                $(newModal.$el).on("hide", function() {
                    // Not taking any action on hide, but you can if you want to!
                })

                newModal.body.append('<img src="/splunkd/__raw/servicesNS/admin/Splunk_Security_Essentials/static/appIcon_2x.png" style="float: right" /><p>Welcome to Splunk Security Essentials ' + currentVersion + '! This release includes tons of bug fixes, enhancements to bookmarking, detailed MITRE ATT&CK Technique-level mapping, a new in-app search engine -- all of those are minor compared to the big new beta content: Data Inventory and the Analytics Advisor dashboards.</p>',
                    "<p>The goal of these new beta features are to provide more concrete recommendations about what content will drive the most value for your organization. This comes in many flavors -- understanding what data sources you have in the environment, what content you already have enabled, and then providing you dashboards to help identify the best content, including maturity graphs, per-data-source filters, a MITRE ATT&CK Map, and more. </p><p>Check out <a href=\"beta_overview\">the overview page</a> for all the details, and <a href=\"mailto:sse@splunk.com?subject=SSE 2.4.0 Feedback\">please give us feedback <i class=\"icon-mail\" /></a> on how it works for you!</p")
                newModal.body.find("#filterContentWhatsNew").click(function() {
                    localStorage[localStoragePreface + "-category"] = 'ALL'
                    localStorage[localStoragePreface + "-category-Multiple"] = '["ALL"]'
                    localStorage[localStoragePreface + "-datasource"] = 'ALL'
                    localStorage[localStoragePreface + "-datasource-Multiple"] = '["ALL"]'
                    localStorage[localStoragePreface + "-displayapp"] = 'Splunk_Security_Essentials'
                    localStorage[localStoragePreface + "-displayapp-Multiple"] = '["Splunk_Security_Essentials"]'
                    localStorage[localStoragePreface + "-enabledFilters"] = '["journey","usecase","category","datasource","highlight","released","displayapp"]'
                    localStorage[localStoragePreface + "-highlight"] = 'ALL'
                    localStorage[localStoragePreface + "-highlight-Multiple"] = '["ALL"]'
                    localStorage[localStoragePreface + "-journey"] = 'Stage_6'
                    localStorage[localStoragePreface + "-journey-Multiple"] = '["Stage_1","Stage_2","Stage_3","Stage_4","Stage_5","Stage_6"]'
                    localStorage[localStoragePreface + "-released"] = '2_2_0'
                    localStorage[localStoragePreface + "-released-Multiple"] = '["2_2_0"]'
                    localStorage[localStoragePreface + "-usecase"] = 'ALL'
                    localStorage[localStoragePreface + "-usecase-Multiple"] = '["ALL"]'
                    setUpNav()
                })
                newModal.footer.append($('<button>').addClass('mlts-modal-submit').attr({
                    type: 'button',
                    'data-dismiss': 'modal'
                }).addClass('btn btn-primary mlts-modal-submit').text('Close').on('click', function() {
                    // console.log("Closing modal..")
                }))

                newModal.show()
                $(".modal").find(".modal-body").css("overflow", "scroll")
            })


        }))
        if (typeof localStorage["Splunk_Security_Essentials-" + currentVersion + "-PageViews"] == "undefined" || localStorage["Splunk_Security_Essentials-" + currentVersion + "-PageViews"] == "undefined") {
            localStorage["Splunk_Security_Essentials-" + currentVersion + "-PageViews"] = 1
        } else {
            localStorage["Splunk_Security_Essentials-" + currentVersion + "-PageViews"]++
        }
        if (localStorage["Splunk_Security_Essentials-" + currentVersion + "-PageViews"] < 2) {
            $('#whatsnewbutton').css("border-color", "gray").css("border-width", "2px").css("font-weight", "bold")
        }

    })