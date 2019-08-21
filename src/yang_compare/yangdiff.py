import subprocess
import requests

def fileCompare(oldvers, oldfile, newvers, newfile, difftype):
	result = getAndOrModifyFiles(oldvers, oldfile, True)
	if result['errors']:
		return {"output": "", "errors": result["errors"], "warnings": []}
	result = getAndOrModifyFiles(newvers, newfile, False)
	if result['errors']:
		return {"output": "", "errors": result["errors"], "warnings": []}
	warnings = []
	result = checkForValidFiles(oldfile[:-5] + "-" + oldvers, "yang_old")
	if result['errors']:
		return {"output": "", "errors": result["errors"], "warnings": result['warnings']}
	if result['warnings']:
		warnings += result['warnings']
	result = checkForValidFiles(newfile[:-5], "yang_new")
	if result['errors']:
		return {"output": "", "errors": result["errors"], "warnings": result['warnings']}
	if result['warnings']:
		warnings += result['warnings']
	subpr = subprocess.run([
		"yangdiff-pro",
		"--old=yang_old/" + oldfile[:-5] + "-" + oldvers + ".yang",
		"--new=yang_new/" + newfile,
		"--modpath=" + "yang_old:yang_new",
		"--difftype=" + difftype,
		"--header=false"], capture_output=True, text=True)
	output = subpr.stdout.strip('\n')
	errors = []
	if output.startswith("Error"):
		errors.append("Comparison Unsuccessful")
	return {"output": cleanOutput(output, oldvers, newvers), "errors": errors, "warnings": warnings}

def cleanOutput(output, oldvers, newvers):
	result = []
	i = 0
	lines = output.splitlines()
	header_parsed = False
	while i < len(lines):
		line = lines[i]
		if not header_parsed:
			if line.startswith("Warning: Module") and line.endswith("not used"):
				# this warning will be taken care of through pyang
				i += 3
				continue
			if line.startswith("// old:"):
				oldHeader = line.split()
				oldHeader[2] = oldvers + "/" + oldHeader[2][:-(len(oldvers) + 1)]
				oldHeader[4] = oldvers + "/" + oldHeader[4][:-(len(oldvers) + 1 + 5)] + ".yang"
				line = ' '.join(oldHeader)
			if line.startswith("// new:"):
				newHeader = line.split()
				newHeader[2] = newvers + "/" + newHeader[2]
				newHeader[4] = newvers + "/" + newHeader[4]
				line = ' '.join(newHeader)
				header_parsed = True
		result.append(line)
		i += 1
	return '\n'.join(result)

def createYangDirectories():
	subprocess.run([
		"mkdir",
		"yang_old"])
	subprocess.run([
		"mkdir",
		"yang_new"])

def emptyYangDirectories():
	subprocess.call("rm -r yang_old/*", shell=True)
	subprocess.call("rm -r yang_new/*", shell=True)

def getAndOrModifyFiles(vers, file, old):
	file_list = [file[:-5]]
	completed = set()
	primaryFileChecked = False
	while file_list:
		cur = file_list.pop()
		if cur in completed:
			continue
		if old:
			f = open("yang_old/" + cur + "-" + vers + ".yang", "w+")
		else:
			f = open("yang_new/" + cur + ".yang", "w+")
		url = "https://raw.githubusercontent.com/YangModels/yang/master/vendor/cisco/xr/" + vers + "/" + cur + ".yang"
		content = requests.get(url)
		if (content.status_code == 404):
			return {"errors": ["File Not Found: " + vers + "/" + cur + ".yang"]}
		if not primaryFileChecked:
			primaryFileChecked = True
			if content.text.startswith("submodule"):
					return {"errors":  ["Please select a primary module or types file to compare. You have selected a submodule." +
				"\nA node tree cannot be constructed from this file."]}
		header_parsed = False
		filename_parsed = False
		for line in content.text.splitlines(True):
			if header_parsed or line.find("/***") != -1:
				f.write(line)
				continue
			if not filename_parsed:
				filename_parsed = True
				if old:
					f.write(modifyLine(line, vers)[0])
				else:
					f.write(line)
				continue
			if line.find("import") != -1 or line.find("include") != -1 or line.find("belongs-to") != -1:
				tab = len(line) - len(line.lstrip())
				if old:
					result = modifyLine(line[tab:], vers)
					file_list.append(result[1])
					f.write(line[:tab] + result[0])
				else:
					file_list.append(line[tab:].split()[1])
					f.write(line)
				continue
			if line.find("organization") >= 0:
				header_parsed = True
			f.write(line)
		f.close()
		completed.add(cur)
	return {"errors": []}

def modifyLine(line, vers):
	words = line.split()
	file_name = words[1]
	words[1] = words[1] + "-" + vers
	words.append('\n')
	return [' '.join(words), file_name]

def checkForValidFiles(file, dir_name):
	subpr = subprocess.run([
		"pyang", 
		"-f", 
		"tree", 
		dir_name + "/" + file + ".yang",  
		"-p",
		dir_name], capture_output=True, text=True)
	print(subpr.stdout)
	if subpr.stderr != "":
		print(subpr.stderr)
		index = subpr.stderr.find("]")
		if index != -1:
			# this error should not occur. would be caught by getAndOrModifyFiles()
			# occurs when file path given to pyang does not exist
			return {"errors": ["File set invalid", (subpr.stderr[index + 2:]).strip('\n')], "warnings": []}
		errors = []
		warnings = []
		for line in subpr.stderr.splitlines():
			if line.find("error") != -1:
				line = line[line.find("error: ") + 7:]
				line = line[:1].upper() + line[1:]
				errors.append(line)
			else:
				line = line[line.find("warning: ") + 9:]
				line = line[:1].upper() + line[1:]
				warnings.append(line)
		return {"errors": errors, "warnings": warnings}
	return {"errors": [], "warnings": []}

def main():
	# emptyYangDirectories()
	createYangDirectories()
	result = fileCompare("633", "Cisco-IOS-XR-telemetry-model-driven-oper.yang", 
		"652", "Cisco-IOS-XR-telemetry-model-driven-oper.yang", "revision")
	print(result["output"])

if __name__ == "__main__":
	main()

	

