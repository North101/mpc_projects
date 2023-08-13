import asyncio
import glob
import json
import os
from io import StringIO

import aiohttp
import lxml.html
from dotenv import load_dotenv

load_dotenv('mpc_refresher.env')


def print_progress_bar(iteration: int, total: int, prefix='', suffix='', decimals=1, length=100, fill='█', print_end='\r'):
  percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
  filled_length = length * iteration // total
  bar = fill * filled_length + '-' * (length - filled_length)
  print(f'\r{prefix} |{bar}| {percent}% {suffix}', end=print_end)
  # Print New Line on Complete
  if iteration == total:
    print()


def parse_html(text):
  return lxml.html.parse(StringIO(text))


def cookies(cookie):
  return {
    "PrinterStudioCookie": cookie,
  }


async def load_image(session, project_id, image):
  async with session.get(f'https://www.makeplayingcards.com/{image}') as r:
    if r.content_type != 'image/jpeg':
      print(f'[{project_id}] Could not load image {image}')


async def load_project_preview(session, project_id):
  r = await session.get(f'https://www.makeplayingcards.com/design/dn_temporary_parse.aspx?id={project_id}&edit=Y')
  if r.real_url.path == '/design/dn_preview_layout.aspx':
    return r

  url = r.real_url.with_path('/design/dn_preview_layout.aspx').with_query(ssid=r.real_url.query['ssid'])
  return await session.post(url)


async def load_project(session, project_id):
  print(f'ProjectId: {project_id}')
  r = await load_project_preview(session, project_id)

  html = parse_html(await r.text())
  front_nodes = html.xpath('//*[@id="divPreviewElements"]//*[@class="m-itemside"]//*[@class="m-front"]//a//img/@src')
  back_nodes = html.xpath('//*[@id="divPreviewElements"]//*[@class="m-itemside"]//*[@class="m-back"]//a//img/@src')

  return [
    (project_id, node[2:])
    for node in (front_nodes + back_nodes)
  ]


async def login(session, email, password):
  data = {
    '__EVENTTARGET': 'btn_submit',
    '__EVENTARGUMENT': '',
    '__VIEWSTATE': '/wEPDwUKMTM3NjI2NzUxMg8WAh4TVmFsaWRhdGVSZXF1ZXN0TW9kZQIBFgICAw9kFgICAQ9kFggCCw8WAh4Hb25jbGljawUnamF2YXNjcmlwdDpyZXR1cm4gYnRuX3N1Ym1pdF9vbmNsaWNrKCk7ZAINDxYCHgRocmVmBRouL3N5c3RlbS9zeXNfcmVnaXN0ZXIuYXNweGQCDw8PFgQeBUFwcElkBQ8xNzQ3NjU5NzU5ODUyNTceCExvZ2luVXJsBQpsb2dpbi5hc3B4ZGQCEQ8PFgQeCENsaWVudElkBUg2NjY1Mjc5MDE0OTAtZWRmMzM1NGFtODh1OGR2cDI2YWQ5NGw1MDY1bGRxNDIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20fBAUKbG9naW4uYXNweGRkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYBBQxja2JfcmVtZW1iZXJAO4PuIRL4YBdOmiolbn9lUmBRRg==',
    '__VIEWSTATEGENERATOR': 'C2EE9ABB',
    'txt_email': email,
    'txt_password': password,
    'g-recaptcha-response': '',
    'hidd_verifyResponse': '',
    'ckb_remember': 'on',
  }
  async with session.post('https://www.makeplayingcards.com/login.aspx', data=data) as r:
    print(r.status)


async def main(email, password, project_ids):
  async with aiohttp.ClientSession() as session:
    await login(session, email, password)

    images = []
    for project_id in project_ids:
      images += await load_project(session, project_id)

    tasks = [
      asyncio.create_task(load_image(session, project_id, image))
      for (project_id, image) in images
    ]

    tasks_done = 0
    def progress_task(task):
      nonlocal tasks_done
      tasks_done += 1
      print_progress_bar(tasks_done, len(tasks))

    for task in tasks:
      task.add_done_callback(progress_task)
    print('Loading Images:')
    await asyncio.wait(tasks)


def read_project_id(filename: str):
  with open(filename, 'r', encoding='utf-8') as f:
    return json.load(f)['projectId']


if __name__ == '__main__':
  asyncio.run(main(
    email=os.environ['EMAIL'],
    password=os.environ['PASSWORD'],
    project_ids=[
      read_project_id(project)
      for project in glob.glob(f'{os.environ["PROJECTS_DIR"]}/*.json')
    ],
  ))
