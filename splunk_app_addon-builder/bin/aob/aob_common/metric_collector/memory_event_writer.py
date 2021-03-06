from future import standard_library
standard_library.install_aliases()
from aob.aob_common.metric_collector.event_writer import *

import queue

class MemoryEventWriter(MetricEventWriter):
    '''
        This class is used to mock a in memory event sink.
        Be careful: all the events are stored in the memory queue
    '''

    def __init__(self, app, config):
        super(MemoryEventWriter, self).__init__(app, config)
        max_queue_size = config.get('max_queue_size', 0)
        self.q = queue.Queue(maxsize=max_queue_size)

    def _flush_msg(self, msg):
        self.q.put(msg)

    def pop_msg(self):
        return self.q.get()

    def get_msg_count(self):
        return self.q.qsize()
