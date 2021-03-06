from __future__ import division

from outputplugin import OutputPlugin


class StdOutOutputPlugin(OutputPlugin):
    useOutputQueue = False
    name = 'stdout'
    MAXQUEUELENGTH = 10000

    def __init__(self, sample, output_counter=None):
        OutputPlugin.__init__(self, sample, output_counter)

    def flush(self, q):
        for x in q:
            print x['_raw'].rstrip()


def load():
    """Returns an instance of the plugin"""
    return StdOutOutputPlugin
