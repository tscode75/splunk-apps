import os
import re
import sys
import csv
import codecs

import ut_log
import ut_parse_lib

########
# MAIN #
########
logger = ut_log.setup_logger()

header  = ['url', 'list', 
	'ut_scheme', 'ut_netloc', 'ut_path', 'ut_params', 'ut_query', 'ut_fragment',
	'ut_domain', 'ut_tld', 'ut_domain_without_tld', 'ut_subdomain', 'ut_port', 
	'ut_subdomain_parts', 'ut_subdomain_count',
]

csv_in  = csv.DictReader(sys.stdin) # automatically use the first line as header
csv_out = csv.DictWriter(sys.stdout, header)
csv_out.writerow(dict(zip(header,header))) # write header

TLDList = None

for row in csv_in:
	url = row['url'].strip()

	if TLDList == None :
		try:
			l = "pouet"
			if 'list' in row :
				l = row['list'].strip().lower()
			TLDList = ut_parse_lib.loadTLDFile(l)
		except Exception, e:
			logger.error("Failed to load TLD list with error: %s" % str(e))

	try:
		res = ut_parse_lib.parse_extended(url, TLDList)
		row.update( res )
	except Exception, e:
		logger.error("Got error %s on with url %s" % (str(e), url))

	# return row to Splunk
	csv_out.writerow(row)

