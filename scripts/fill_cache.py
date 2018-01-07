import json
import logging
import sys
import os
import urllib

import grequests
import click
from bs4 import BeautifulSoup

DEFAULT_HEADERS = {
    'accept-encoding': 'gzip, deflate, br',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'authorization': 'Basic ZGF0YWNoaWxlOmNoaWNoaWNoaQ=='
}

logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

cncr_conns = 1

@click.command()
@click.option('--base', default='https://es.datachile.io', help='Base URL')
@click.option('--geojson',
              default=os.path.join(os.path.dirname(os.path.realpath(__file__)), '../app/helpers/geo_regions.json'),
              help='Path to geo_regions.json')
@click.option('--cachecomunas', default=False, help='Fill cache for comunas')
@click.option('--concurrency', default=10, help='Number of concurrent connetions')
def fill_cache(base, geojson, cachecomunas, concurrency):
    """Fill Datachile cache (Geo profiles)"""

    cncr_conns = concurrency

    grequests.map([grequests.get(profile_url,
                                 headers=DEFAULT_HEADERS,
                                 hooks={'response': [get_chart_data]})
                   for profile_url in geo_profile_urls(base, geojson, cachecomunas)],
                  size=cncr_conns)


def get_chart_data(response, *request_args, **request_kwargs):

    b = BeautifulSoup(response.text)
    lines = b.script.text.split('\n')

    try:
        i = next((i for i, line in enumerate(lines) if line.rfind('window.__INITIAL_STATE') != -1 ))
        state = json.loads('{' + '\n'.join(lines[i+1:-2]) + '}')
        chart_data_urls = [v for k, v in state['data'].items() if k.startswith('path_')]

        reqs = [grequests.get(cdu, headers=DEFAULT_HEADERS)
                for cdu in chart_data_urls]

        grequests.map(reqs,
                      size=cncr_conns)

    finally:
        return response


def geo_profile_urls(base_url, geojson_path, cachecomunas):
    with open(geojson_path, 'r') as f:
        geos = json.load(f)

    for region in geos:
        yield urllib.parse.urljoin(base_url, "geo/%s-%s" % (region['slug'], region['key']))
        if not cachecomunas:
            continue
        for comuna in region['children']:
            yield urllib.parse.urljoin(base_url, "geo/%s-%s/%s-%s" % (region['slug'], region['key'], comuna['slug'], comuna['key']))

if __name__ == '__main__':
    fill_cache()
