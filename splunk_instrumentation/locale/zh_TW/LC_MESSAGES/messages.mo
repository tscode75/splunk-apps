??    ?      ?  ?   <      ?     ?     ?       ^     K   x     ?     ?     ?     ?     ?     ?     ?     ?  +  ?     %  	   -  ?   7  7   ?  W   	     a     w     |     ?  "   ?  $   ?  %   ?       1     o   ?  ?   ?  '   7  :   _     ?     ?  '   ?  ?   ?  5   m     ?     ?  	   ?  
   ?  
   ?  @   ?  $   $      I      P      X   ?   g      !     !  O   !  ?   n!     ?!      "     	"     "     ."  T   6"     ?"  	   ?"     ?"     ?"     ?"     ?"     #  1   -#  W   _#  G   ?#     ?#     $     $     <$     C$     J$     ^$     e$     j$  T   ?$     ?$     ?$  2   ?$     +%     ;%     Y%     e%     u%     ?%     ?%     ?%  
   ?%  
   ?%     ?%  	   ?%     ?%     ?%     ?%     ?%     ?%     &     &  )   &      ?&     `&     r&  $   x&  &  ?&  -   ?'  |  ?'     o)     ?)     ?)     ?)     ?)     ?)     ?)     ?)     ?)     ?)  
   ?)  .   ?)     !*     &*  ?   C*     
+     +     +     +     %+     1+     =+  a   I+  ?   ?+     m,     v,  	   ?,  ?   ?,  ?   .-  &  ?-  |   #/     ?/     ?/  
   ?/     ?/  ~   ?/  	   I0     S0     `0     m0  	   q0     {0     ~0     ?0  	   ?0     ?0     ?0  #   ?0     ?0  	   ?0  
   ?0     ?0     ?0     1     1     1  	   (1     21     :1     >1     C1     F1     K1     P1     `1     o1     {1     ?1     ?1  0  ?1     ?2     ?2     ?2  b   ?2  M   [3     ?3  	   ?3     ?3     ?3     ?3     ?3     ?3     ?3  2  ?3     ?     ?  ?   )?  +   ??  H   ??     )@  	   6@     @@     P@  &   W@  &   ~@  -   ?@     ?@  &   ?@  ]   A  ?   _A     ?A  9   ?A     8B     HB  !   OB  ?   qB  '   ?B     C     "C     5C     BC     OC  9   \C     ?C     ?C  	   ?C     ?C     ?C     SD  	   `D  H   jD  h   ?D  	   E     &E     -E     4E  	   ME  P   WE  $   ?E     ?E     ?E  &   ?E  '   F  '   6F     ^F  *   kF  N   ?F  >   ?F     $G     +G     EG  	   XG  	   bG     lG     G     ?G     ?G  V   ?G  	   H     H  /   H     JH     WH  	   pH     zH     ?H     ?H     ?H     ?H     ?H     ?H     ?H     ?H     ?H  	   ?H     ?H  	   I  	   I     I     I  *   -I  (   XI     ?I     ?I     ?I    ?I  $   ?J  8  ?J     &L  	   6L     @L     GL     NL     ^L     kL     ~L     ?L     ?L  
   ?L  *   ?L     ?L     ?L  ?   ?L     ?M     ?M     ?M     ?M     ?M     ?M     ?M  [   ?M  ?   8N     ?N     ?N     O  ?   O  ?   ?O    oP  _   rQ     ?Q     ?Q     ?Q     ?Q  l   R     pR  	   wR  	   ?R     ?R     ?R     ?R     ?R     ?R     ?R     ?R     ?R  #   ?R     ?R     ?R     ?R     S     S     S     "S     0S     =S     JS     RS     YS     ]S     `S     gS     lS     ~S     ?S  	   ?S     ?S     ?S            ?       K       .   @   A   ^       t   r   v   D   \   
       f                  R   `   >   +   T   Q       ?   5          ?   #   8           ?   Z              '   ?   -       ;   c          H   ?   ?   ?       ?   V   ?   W   E   _           3   ?   ?   I          p   b   ?   w      ?   9       C                  U   e   ?   	   (   <   "   ?   ]          ?   u      ?   *       z       S   ?           m          ?   x      ?               ?   ?   ?      i   $          ?   )      /   F   O   7                   0   4   h      g   ?       ?   }   a   ?          ?   G   =   ?   ?   [       ?   ?   ~   M       J   1      ?      ?      P       l   ,       j       ?      ?       ?   ?           L           n   ?      %   k   ?   ?      X   ?       y   ?   ?   2             ?   ?   s   &   q   Y   d   B   ?                  ?   ?                   :          {   ?      6   !       |          ?   o   N     at   next to "Usage Data"  on  "Full" includes bucket manifests and metadata files, if the index_files component is selected. "Light" lists only hot buckets, if the index_listing component is selected. %s %s Data %s Usage Data 1 GB 1 MB 10 MB 100 MB 5 GB <form class="form-horizontal form-complex">
    <div class="control-group">
        <label class="control-label" for="outputtelemetry_component">Name</label>

        <div class="controls">
            <input type="text" class="input-xlarge" name="action.outputtelemetry.param.component" id="outputtelemetry_component" placeholder="component.name"/>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="outputtelemetry_input">Input field</label>

        <div class="controls">
            <input type="text" class="input-xlarge" name="action.outputtelemetry.param.input" id="outputtelemetry_component" placeholder="field name"/>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="outputtelemetry_type">Data type</label>

        <div class="controls">
            <label class="radio" for="outputtelemetry_type_event">
                <input id="outputtelemetry_type_event" type="radio" name="action.outputtelemetry.param.type" value="event"/>
                Event
            </label>
            <label class="radio" for="outputtelemetry_type_aggregate">
                <input id="outputtelemetry_type_aggregate" type="radio" name="action.outputtelemetry.param.type" value="aggregate"/>
                Aggregate
            </label>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label">Categories (at least 1):</label>
        <div class="controls">
            <label class="checkbox" for="outputtelemetry_anonymous">
                <input type="checkbox" name="action.outputtelemetry.param.anonymous" id="outputtelemetry_anonymous" value="1"/>
                Anonymized usage data
            </label>
        </div>
        <div class="controls">
            <label class="checkbox" for="outputtelemetry_support">
                <input type="checkbox" name="action.outputtelemetry.param.support" id="outputtelemetry_support" value="1"/>
                Support usage data
            </label>
        </div>
        <div class="controls">
            <label class="checkbox" for="outputtelemetry_license">
                <input type="checkbox" name="action.outputtelemetry.param.license" id="outputtelemetry_license" value="1"/>
                License usage data
            </label>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="outputtelemetry_optinrequired">Required opt-in</label>

        <div class="controls">
            <select id="outputtelemetry_optinrequired" name="action.outputtelemetry.param.optinrequired">
                <option value="1">1 - Splunk 6.5</option>
                <option value="2">2 - Splunk 6.6</option>
                <option value="3">3 - Splunk 7.0</option>
            </select>
        </div>
    </div>
</form>
 Actions All Roles All files matching the given patterns will be excluded. To exclude multiple files, use wildcards, or provide a comma-separated list of files or patterns. Are you sure you want to disable %s usage data sharing? Attempt to redact search terms from logs that may be private or personally identifying. Automatically enabled Back Business week to date Cancel Cannot delete diag with status: %s Cannot download diag with status: %s Change your settings by clicking the  Close Combines specified fields into a stringified JSON Combines the specified set of field names, or field name patterns, \
and creates an field with the output name. Configure automated reporting settings, view collected data, export data to file, work with diagnostic files, and send data to Splunk.  Configure automated reporting settings. Configure bundle settings to be applied to all instances.  Configure instrumentation. Create Create New Diags using the button above Create a stringified JSON: { "name": "<value of name>", "data": { "count": <value of data.count>, "metrics": [values of data.metrics] }} Custom action to output results to telemetry endpoint Data Data Transmission Schedule Data Type Date Range Date range Date ranges more than 1 year are truncated to a year from latest Date ranges must be less than 1 year Delete Deleted Diagnostic Log Diagnostic files contain information about your Splunk deployment, such as configuration files and logs, to help Splunk Support diagnose and resolve problems.  Disable limit Disabled Disabling this may hinder troubleshooting and support for your implementation.  Disabling this will exclude your usage data from the data Splunk considers when making improvements to our products and services.  Does not exist Download Edit Edit Data Transmission Schedule Enabled Error communicating with Splunk. Please check your network connection and try again. Error fetching list of servers Error: %s Every %s at %s Exclude etc files larger than Exclude log files larger than Exclude log files older than Exclude patterns Excludes large files in the Splunk etc directory. Excludes large files in the Splunk var/log directory, if the log component is selected. Excludes log files beyond an age given in days. 0 disables this filter. Export Export/Send Usage Data Exporting instrumentation data Failed Filter Filter search terms Friday Full Get every crash .dmp file If "No", gathers at most three Windows .dmp files, if the log component is selected. In progress Include components Include lookup files in the etc & pool components. Include lookups Index directory listing level Index files Instrumentation Instrumentation | Splunk Last 24 hours Last 30 days Last 7 days Learn More Learn more Light Manifests Monday Month to date Name New Diag Next No No Diags found No data available for selected time range No data sent in the last 30 days No results found. Nodes Output results to telemetry endpoint Output search results to the telemetry endpoint, using the field named "data."" Each will be \
named "my.telemetry" and is described as a singular "event" type. The telemetry event will only be \
sent if the deployment has been opted in to share Anonymized usage data, with opt-in version of 2. Outputs search results to telemetry endpoint. Outputs search results to telemetry endpoint. \
Required field “input” will have the endpoint payload. \
The other fields “component”, “type”, “optinrequired” \
are optional fields but the endpoint expects them to be supplied either with the search command \
or to be found in the event data.\
Visibility fields "anonymous", "license" and "support" are optional. Previous business week Previous month Previous week Previous year Queued Recreate Revert to default Roles Saturday Save Scheduled  Select instance you want to collect data from. Send Sending instrumentation data Sharing your software usage data helps Splunk Inc. optimize your deployment, prioritize our features, improve your experience, notify you of patches, and develop high quality product functionality.  Size Status Success Sunday TestHeader1 TestHeader2 TestHeader3 This application connects the hosting Splunk instance to Splunk's usage data collection services. This list shows the instances connected to this search head. If you have configured Monitoring Console in distributed mode, use that instance to collect data from any instances not listed here. Thursday Time Created Time Sent To ensure compliance with your purchased offering, we collect data about your license consumption. This data is linked to your account using your license GUID.  To improve our products and offerings, we collect aggregated data about feature usage, performance, deployment topology, infrastructure, and operating environment. This data is not linked to your account.  To provide you enhanced support and help you troubleshoot and improve your implementation, we collect aggregated data about this deployment's feature usage, performance, deployment topology, infrastructure and operating environment. This data is linked to your account using your license GUID.  To understand the number of customers using older versions of Splunk software, we collect aggregated software version data.  Today Tuesday Usage Data View in Search:  View license usage, anonymized usage, and support usage data that has been collected (does not include browser session data).  Wednesday Week to date Year to date Yes Yesterday am body conf_replication_summary consensus day dispatch e.g. *.csv to exclude all csv files etc every day every week file_validate footer index_files index_listing instance instances kvstore log page pm pool rest results::filter results::write searchpeers selected static-content unknown error Project-Id-Version: PROJECT VERSION
Report-Msgid-Bugs-To: EMAIL@ADDRESS
PO-Revision-Date: 2020-09-07 14:47+0100
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.6.0
Last-Translator: 
Language-Team: 
Language: zh_TW
X-Generator: Poedit 2.4.1
  於   前往「用量資料」  於  若選取 index_files 元件，則「Full」包括索引分集資訊清單和中繼資料檔案。 若選取 index_listing 元件，則「Light」僅列出熱門索引分集。 %s %s 資料 %s 用量資料 1 GB 1 MB 10 MB 100 MB 5 GB <form class="form-horizontal form-complex">
    <div class="control-group">
        <label class="control-label" for="outputtelemetry_component">名稱</label>

        <div class="controls">
            <input type="text" class="input-xlarge" name="action.outputtelemetry.param.component" id="outputtelemetry_component" placeholder="component.name"/>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="outputtelemetry_input">輸入欄位</label>

        <div class="controls">
            <input type="text" class="input-xlarge" name="action.outputtelemetry.param.input" id="outputtelemetry_component" placeholder="field name"/>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="outputtelemetry_type">資料類型</label>

        <div class="controls">
            <label class="radio" for="outputtelemetry_type_event">
                <input id="outputtelemetry_type_event" type="radio" name="action.outputtelemetry.param.type" value="event"/>
                事件
            </label>
            <label class="radio" for="outputtelemetry_type_aggregate">
                <input id="outputtelemetry_type_aggregate" type="radio" name="action.outputtelemetry.param.type" value="aggregate"/>
                彙總
            </label>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label">類別 (至少 1 個)：</label>
        <div class="controls">
            <label class="checkbox" for="outputtelemetry_anonymous">
                <input type="checkbox" name="action.outputtelemetry.param.anonymous" id="outputtelemetry_anonymous" value="1"/>
                匿名化用量資料
            </label>
        </div>
        <div class="controls">
            <label class="checkbox" for="outputtelemetry_support">
                <input type="checkbox" name="action.outputtelemetry.param.support" id="outputtelemetry_support" value="1"/>
                支援用量資料
            </label>
        </div>
        <div class="controls">
            <label class="checkbox" for="outputtelemetry_license">
                <input type="checkbox" name="action.outputtelemetry.param.license" id="outputtelemetry_license" value="1"/>
                授權用量資料
            </label>
        </div>
    </div>
    <div class="control-group">
        <label class="control-label" for="outputtelemetry_optinrequired">必須選擇加入</label>

        <div class="controls">
            <select id="outputtelemetry_optinrequired" name="action.outputtelemetry.param.optinrequired">
                <option value="1">1 - Splunk 6.5</option>
                <option value="2">2 - Splunk 6.6</option>
                <option value="3">3 - Splunk 7.0</option>
            </select>
        </div>
    </div>
</form>
 動作 全部角色 所有符合指定樣式的檔案將被排除。可使用萬用字元或提供檔案或樣式的逗號分隔清單來排除多個檔案。 您確定要停用 %s 用量資料分享？ 嘗試回應來自可能為私人或個人識別記錄的搜尋字彙。 自動啟用 上一步 工作週迄今 取消 無法刪除以下狀態的診斷：%s 無法下載以下狀態的診斷：%s 按一下下列按鈕以變更您的設定： 關閉 將指定欄位合併為字串化 JSON 合併欄位名稱的指定設定或欄位名稱樣式，\ 
並以輸出名稱建立欄位。 設定自動回報設定、檢視收集的資料、將資料匯出成檔案、使用診斷檔案，並將資料傳送至 Splunk。 設定自動回報設定。 設定要套用到全部執行個體的設定包設定。 設定檢測。 建立 使用上方按鈕建立新診斷 建立字串化 JSON：{ "name": "<value of name>", "data": { "count": <value of data.count>, "metrics": [data.metrics 的值] }} 自訂遙測端點的輸出結果動作 資料 資料傳輸排程 資料類型 日期範圍 日期範圍 超過 1 年的資料範圍會擷取最近 1 年的資料 資料範圍必須少於 1 年 刪除 已刪除 診斷記錄 診斷檔案含有設定檔和記錄等與您的 Splunk 部署相關的資訊，可協助 Splunk 支援診斷並解決問題。 停用限制 已停用 停用此功能可能會妨礙疑難排解和針對您實作的支援。 停用此功能會將您的用量資料從 Splunk 在改善產品和服務時考慮的資料中排除。 不存在 下載 編輯 編輯資料傳輸排程 已啟用 與 Splunk 通訊時發生錯誤。請檢查您的網路連線並再試一次。 擷取伺服器清單時發生錯誤 錯誤：%s 每 %s 的 %s 排除大於下列容量的 etc 檔： 排除大於下列容量的記錄檔： 排除早於下列時間的記錄檔： 排除樣式 排除 Splunk etc 目錄的大型檔案。 若選取 log 元件，則會排除 Splunk var/log 目錄中的大型檔案。 排除超過所給天數的記錄檔案。0 停用此篩選。 匯出 匯出/傳送用量資料 匯出檢測資料 已失敗 篩選器 篩選搜尋詞彙 週五 完整 取得每個損毀的 .dmp 檔 若「否」，且已選取記錄元件，則會收集最多三個 Windows .dmp 檔。 進行中 包含元件 包含 etc 和集區元件中的查閱檔案。 包含查閱 索引目錄清單層級 索引檔 檢測 檢測 | Splunk 前 24 小時 最近 30 天 最近 7 天 進一步瞭解 進一步瞭解 Light 資訊清單 週一 月迄今 名稱 新診斷 下一步 否 找不到診斷 所選取時間範圍沒有可用的資料 過去 30 天內沒有已傳送的資料 找不到結果。 節點 遙測端點的輸出結果 遙測端點的輸出搜尋結果，使用名稱為「資料」的欄位。每個欄位將命名為「my.telemetry」，且描述為單一「事件」類型。只有在部署已選擇加入來分享匿名用量資料時 (選擇加入版本 2)，遙測事件才會傳送。 遙測端點的輸出搜尋結果。 遙測端點的輸出搜尋結果。必填欄位「輸入」會有端點裝載。其他的「元件」、「類型」、「必須加入」欄位為可選欄位，但端點預期這些欄位由搜尋命令提供或可在事件資料中尋找。可見度欄位「匿名」、「授權」和「支援」為可選。 上個工作週 上個月 上週 去年 已排入佇列 重新建立 還原為預設值 角色 週六 儲存 已排程  選取您想收集資料的執行個體。 傳送 傳送檢測資料 分享您的軟體用量資料協助 Splunk Inc. 來最佳化您的部署、排定功能的優先順序、改善您的體驗、修補程式通知，並開發高品質的產品功能。 大小 狀態 成功 週日 TestHeader1 TestHeader2 TestHeader3 此應用程式將裝載的 Splunk 執行個體和 Splunk 用量資料收集服務連線。 此清單顯示連線至此搜尋頭端點的執行個體。若您已在分散模式設置監控主控台，使用該執行個體來收集未列於此的執行個體的資料。 週四 已建立時間 已傳送時間 為了確保您的採購合約符合法規遵循，我們會收集與您授權消費相關的資料。此資料會使用您的授權 GUID 來與您的帳戶連結。 為了改善我們的產品和合約，我們會收集與功能用量、效能、部署拓撲、基礎建設和作業環境相關的彙總資料。此資料不與您的帳戶連結。 為了提供您有效的支援、協助您疑難排解並改善您的實作，我們會收集與此部署的功能使用、效能、部署拓撲、基礎建設和作業環境相關的彙總資料。此資料使用您的授權 GUID 來與您的帳戶連結。 為了瞭解使用舊版 Splunk 軟體的顧客數，我們會收集彙總軟體版本資料。 今天 週二 用量資料 在搜尋中檢視： 檢視已收集的授權用量、匿名用量和支援用量資料 (不包含瀏覽器工作階段資料)。 週三 週迄今 年迄今 是 昨天 am 本文 conf_replication_summary 共識 天 發送 例如，*.csv 排除全部 csv 檔 etc 每天 每週 file_validate footer index_files index_listing 執行個體 執行個體 kvstore 記錄 頁 pm 集區 rest 結果::篩選器 結果::寫入 searchpeers 已選取 靜態-內容 未知錯誤 