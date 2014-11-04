#!/usr/bin/env python

import argparse
from clint.textui import colored, indent, puts
import subprocess

if __name__ == '__main__':

	parser = argparse.ArgumentParser(description='SPINE: A Cross-Platform Framework for Mobile Health Application Development.' )
	subparsers = parser.add_subparsers(dest='subcommand', help='general spine usage')

	# create the parser for the "generate" command
	parser_gen = subparsers.add_parser('generate', help='scaffold an application using the given generator')
	parser_gen.add_argument('name', metavar='<name>', type=str, action='store', default='newSpineApp', help='the name of the new application')
	#parser_gen.add_argument('generate', metavar='<generator>', type=str, action='store', default='spine', help='the spine generator')

	# create the parser for the "build" command
	parser_build = subparsers.add_parser('build', help='build the given spine application for the specified environment(s)')
	parser_build.add_argument('environment', metavar='<environment>', type=str, action='store', choices=['ios', 'android'], help='desired environment')

	# create the parser for the "add" command
	parser_add = subparsers.add_parser('add', help='add the given mobile environment')
	parser_add.add_argument('environment', metavar='<environment>', type=str, action='store', choices=['ios', 'android'], help='desired environment')

	args = parser.parse_args()

	print args

	if args.subcommand == 'generate':
		print "ayyyyy we generating"
		
		cmd = 'yo'
		flags = 'spine'
		subprocess.call([cmd, flags])

	elif args.subcommand == 'add':
		print "ayyyyy we adding"
		
		cmd = 'cordova'
		flags = 'platform add %s' % ( args.environment )
		subprocess.call([cmd, flags])
		
	elif args.subcommand == 'build':
		print "ayyyyy we building"

		cmd = 'grunt'
		flags = 'platform build'
		subprocess.call([cmd, flags])


