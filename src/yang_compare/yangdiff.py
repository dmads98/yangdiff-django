import subprocess
import requests

def fileCompare(oldvers, oldfile, newvers, newfile):
	diff_type = "normal"
	header = "false"
	result = getAndOrModifyFiles(oldvers, oldfile, True)
	if result['errors']:
		return {"output": "", "errors": result["errors"]}
	result = getAndOrModifyFiles(newvers, newfile, False)
	if result['errors']:
		return {"output": "", "errors": result["errors"]}
	result = check_for_valid_files(oldfile[:-5] + "-" + oldvers, "yang_old")
	if result['errors']:
		return {"output": "", "errors": result["errors"]}
	result = check_for_valid_files(newfile[:-5], "yang_new")
	if result['errors']:
		return {"output": "", "errors": result["errors"]}
	subpr = subprocess.run([
		"yangdiff-pro",
		"--old=yang_old/" + oldfile[:-5] + "-" + oldvers + ".yang",
		"--new=yang_new/" + newfile,
		"--modpath=" + "yang_old:yang_new",
		"--difftype=" + diff_type,
		"--header=" + header], capture_output=True, text=True)
	output = subpr.stdout.strip('\n')
	errors = []
	if output.startswith("Error"):
		print("Error(s) occurred - Comparison unsuccessful")
		error = output[7:output.find("yangdiff")]
		error = error[:1].upper() + error[1:]
		error = error.strip('\n')
		errors.append(error)
	return {"output": cleanHeader(output, oldvers, newvers), "errors": errors}

def cleanHeader(output, oldvers, newvers):
	lines = output.splitlines()
	oldHeader = lines[0].split()
	oldHeader[2] = oldvers + "/" + oldHeader[2][:-(len(oldvers) + 1)]
	oldHeader[4] = oldvers + "/" + oldHeader[4][:-(len(oldvers) + 1 + 5)] + ".yang"
	lines[0] = ' '.join(oldHeader)
	newHeader = lines[1].split()
	newHeader[2] = newvers + "/" + newHeader[2]
	newHeader[4] = newvers + "/" + newHeader[4]
	lines[1] = ' '.join(newHeader)
	return '\n'.join(lines)

# def create_yang_directories():
# 	subprocess.run([
# 		"mkdir",
# 		"yang_old"])
# 	subprocess.run([
# 		"mkdir",
# 		"yang_new"])

def emptyYangDirectories():
	subprocess.call("rm -r yang_old/*", shell=True)
	subprocess.call("rm -r yang_new/*", shell=True)

def getAndOrModifyFiles(vers, file, old):
	file_list = [file[:-5]]
	completed = set()
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
		header_parsed = False
		filename_parsed = False
		for line in content.text.splitlines(True):
			if header_parsed or line.find("/***") != -1:
				f.write(line)
				continue
			if not filename_parsed:
				filename_parsed = True
				if old:
					f.write(modify_line(line, vers)[0])
				else:
					f.write(line)
				continue
			if line.find("import") != -1 or line.find("include") != -1 or line.find("belongs-to") != -1:
				tab = len(line) - len(line.lstrip())
				if old:
					result = modify_line(line[tab:], vers)
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

def modify_line(line, vers):
	words = line.split()
	file_name = words[1]
	words[1] = words[1] + "-" + vers
	words.append('\n')
	return [' '.join(words), file_name]

def create_output_directory():
	subpr = subprocess.run([
		"mkdir",
		"diff_output"])

def check_for_valid_files(file, dir_name):
	subpr = subprocess.run([
		"pyang", 
		"-f", 
		"tree", 
		dir_name + "/" + file + ".yang",  
		"-p",
		dir_name], capture_output=True, text=True)
	if subpr.stderr != "":
		message = "Error(s) occurred - File set invalid"
		index = subpr.stderr.find("]")
		if index != -1:
			return {"errors": [message, (subpr.stderr[index + 2:]).strip('\n')]}
		errors = subpr.stderr.splitlines()
		for line in errors:
			line = line[line.find("error: ") + 7:]
			line = line[:1].upper() + line[1:]
		errors[:0] = message
		return {"errors": errors}
	output = subpr.stdout.strip('\n')
	if output == "":
		return {"errors":  ["Please select a primary module to compare. You have selected a submodule or types file." +
			"\nA node tree cannot be constructed from this file."]}
	return {"errors": []}

def main():
	emptyYangDirectories()
	result = fileCompare("600", "Cisco-IOS-XR-Ethernet-SPAN-cfg.yang", "602", "Cisco-IOS-XR-Ethernet-SPAN-cfg.yang")
	print(result)

if __name__ == "__main__":
	main()
	

