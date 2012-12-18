<?php

/**
 * SplAutoloader defines the contract that any OO based autoloader must follow.
 *
 * @author Guilherme Blanco <guilhermeblanco@php.net>
 */
interface SplAutoloader
{
	/**
	 * Defines autoloader to work silently if resource is not found.
	 *
	 * @const
	 */
	const MODE_SILENT = 0;
 
	/**
	 * Defines autoloader to work normally (requiring an un-existent resource).
	 *
	 * @const
	 */
	const MODE_NORMAL = 1;
 
	/**
	 * Defines autoloader to work in debug mode, loading file and validating requested resource.
	 *
	 * @const
	 */
	const MODE_DEBUG = 2;
 
	/**
	 * Define the autoloader work mode.
	 *
	 * @param integer $mode Autoloader work mode.
	 */
	public function setMode($mode);
 
	/**
	 * Add a new resource lookup path.
	 *
	 * @param string $resourceName Resource name, namespace or prefix.
	 * @param mixed $resourcePath Resource single path or multiple paths (array).
	 */
	public function add($resourceName, $resourcePath = null);
 
	/**
	 * Load a resource through provided resource name.
	 *
	 * @param string $resourceName Resource name.
	 */
	public function load($resourceName);
 
	/**
	 * Register this as an autoloader instance.
	 *
	 * @param boolean Whether to prepend the autoloader or not in autoloader's list.
	 */
	public function register($prepend = false);
 
	/**
	 * Unregister this autoloader instance.
	 *
	 */
	public function unregister();
}

/**
 * SplClassLoader implementation that implements the technical interoperability
 * standards for PHP 5.3 namespaces and class names.
 *
 * https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md
 *
 * Example usage:
 *
 *     $classLoader = new \SplClassLoader();
 *
 *     // Configure the SplClassLoader to act normally or silently
 *     $classLoader->setMode(\SplClassLoader::MODE_NORMAL);
 *
 *     // Add a namespace of classes
 *     $classLoader->add('Doctrine', array(
 *         '/path/to/doctrine-common', '/path/to/doctrine-dbal', '/path/to/doctrine-orm'
 *     ));
 *
 *     // Add a prefix
 *     $classLoader->add('Swift', '/path/to/swift');
 *
 *     // Add a prefix through PEAR1 convention, requiring include_path lookup
 *     $classLoader->add('PEAR');
 *
 *     // Allow to PHP use the include_path for file path lookup
 *     $classLoader->setIncludePathLookup(true);
 *
 *     // Possibility to change the default php file extension
 *     $classLoader->setFileExtension('.php');
 *
 *     // Register the autoloader, prepending it in the stack
 *     $classLoader->register(true);
 *
 * @author Guilherme Blanco <guilhermeblanco@php.net>
 * @author Jonathan H. Wage <jonwage@gmail.com>
 * @author Roman S. Borschel <roman@code-factory.org>
 * @author Matthew Weier O'Phinney <matthew@zend.com>
 * @author Kris Wallsmith <kris.wallsmith@gmail.com>
 * @author Fabien Potencier <fabien.potencier@symfony-project.org>
 */
class SplClassLoader implements SplAutoloader
{
	/**
	 * @var string
	 */
	private $fileExtension = '.php';
 
	/**
	 * @var boolean
	 */
	private $includePathLookup = false;
 
	/**
	 * @var array
	 */
	private $resources = array();
 
	/**
	 * @var integer
	 */
	private $mode = self::MODE_NORMAL;
 
	/**
	 * {@inheritdoc}
	 */
	public function setMode($mode)
	{
		if ($mode & self::MODE_SILENT && $mode & self::MODE_NORMAL) {
			throw new \InvalidArgumentException(
				sprintf('Cannot have %s working normally and silently at the same time!', __CLASS__)
			);
		}
 
		$this->mode = $mode;
	}
 
	/**
	 * Define the file extension of resource files in the path of this class loader.
	 *
	 * @param string $fileExtension
	 */
	public function setFileExtension($fileExtension)
	{
		$this->fileExtension = $fileExtension;
	}
 
	/**
	 * Retrieve the file extension of resource files in the path of this class loader.
	 *
	 * @return string
	 */
	public function getFileExtension()
	{
		return $this->fileExtension;
	}
 
	/**
	 * Turns on searching the include for class files. Allows easy loading installed PEAR packages.
	 *
	 * @param boolean $includePathLookup
	 */
	public function setIncludePathLookup($includePathLookup)
	{
		$this->includePathLookup = $includePathLookup;
	}
 
	/**
	 * Gets the base include path for all class files in the namespace of this class loader.
	 *
	 * @return boolean
	 */
	public function getIncludePathLookup()
	{
		return $this->includePathLookup;
	}
 
	/**
	 * {@inheritdoc}
	 */
	public function register($prepend = false)
	{
		spl_autoload_register(array($this, 'load'), true, $prepend);
	}
 
	/**
	 * {@inheritdoc}
	 */
	public function unregister()
	{
		spl_autoload_unregister(array($this, 'load'));
	}
 
	/**
	 * {@inheritdoc}
	 */
	public function add($resource, $resourcePath = null)
	{
		$this->resources[$resource] = (array) $resourcePath;
	}
 
	/**
	 * {@inheritdoc}
	 */
	public function load($resourceName)
	{
		$resourceAbsolutePath = $this->getResourceAbsolutePath($resourceName);

		switch (true) {
			case ($this->mode & self::MODE_SILENT):
				if ($resourceAbsolutePath !== false) {
					require $resourceAbsolutePath;
				}
				break;
 
			case ($this->mode & self::MODE_NORMAL):
			default:
				require $resourceAbsolutePath;
				break;
		}
 
		if ($this->mode & self::MODE_DEBUG && ! $this->isResourceDeclared($resourceName)) {
			throw new \RuntimeException(
				sprintf('Autoloader expected resource "%s" to be declared in file "%s".', $resourceName, $resourceAbsolutePath)
			);
		}
	}
 
	/**
	 * Transform resource name into its absolute resource path representation.
	 *
	 * @params string $resourceName
	 *
	 * @return string Resource absolute path.
	 */
	private function getResourceAbsolutePath($resourceName)
	{  
		$resourceRelativePath = $this->getResourceRelativePath($resourceName);

		foreach ($this->resources as $resource => $resourcesPath) {
			if (strpos($resourceName, $resource) !== 0) {
				continue;
			}
 
			foreach ($resourcesPath as $resourcePath) {
				$resourceAbsolutePath = $resourcePath . DIRECTORY_SEPARATOR . $resourceRelativePath;
 
				if (is_file($resourceAbsolutePath)) {
					return $resourceAbsolutePath;
				}
			}
		}
 
		if ($this->includePathLookup && ($resourceAbsolutePath = stream_resolve_include_path($resourceRelativePath)) !== false) {
			return $resourceAbsolutePath;
		}
 
		return false;
	}
 
	/**
	 * Transform resource name into its relative resource path representation.
	 *
	 * @params string $resourceName
	 *
	 * @return string Resource relative path.
	 */
	private function getResourceRelativePath($resourceName)
	{
		// We always work with FQCN in this context
		$resourceName = ltrim($resourceName, '\\');
		$resourcePath = '';
 
		if (($lastNamespacePosition = strrpos($resourceName, '\\')) !== false) {
			// Namespaced resource name
			$resourceNamespace = substr($resourceName, 0, $lastNamespacePosition);
			$resourceName      = substr($resourceName, $lastNamespacePosition + 1);
			$resourcePath      =  str_replace('\\', DIRECTORY_SEPARATOR, $resourceNamespace) . DIRECTORY_SEPARATOR;
		}

		return $resourcePath . str_replace('_', DIRECTORY_SEPARATOR, $resourceName) . $this->fileExtension;
	}
 
	/**
	 * Check if resource is declared in user space.
	 *
	 * @params string $resourceName
	 *
	 * @return boolean
	 */
	private function isResourceDeclared($resourceName)
	{
		return class_exists($resourceName, false)
			|| interface_exists($resourceName, false)
			|| (function_exists('trait_exists') && trait_exists($resourceName, false));
	}
}